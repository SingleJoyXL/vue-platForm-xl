import { isArray, isObject, isString } from "#/utils/is";
import { listItemMetaProps } from "ant-design-vue/es/list/ItemMeta";
import { intersectionWith, isEqual, mergeWith, unionWith } from "lodash-es";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: Recordable) {
  if (Object.prototype.toString.call(params) !== "[object Object]") {
    return;
  }

  for (const key in params) {
    const format = params[key]?.format ?? null;
    if (format && typeof format === "function") {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

export function joinTimestamp(join: boolean, restful = false): string | object {
  if (!join) {
    return restful ? "" : {};
  }
  const now = new Date().getTime();
  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}

export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = "";
  for (const key in obj) {
    parameters += key + "=" + encodeURIComponent(obj[key]) + "&";
  }
  parameters = parameters.replace(/&$/, "");
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, "?") + parameters;
}

export function deepMerge<
  T extends object | null | undefined,
  U extends object | null | undefined
>(
  source: T,
  target: U,
  mergeArrays: "union" | "intersection" | "concat" | "replace" = "replace"
): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case "union":
          return unionWith(sourceValue, targetValue, isEqual);
        case "intersection":
          return intersectionWith(sourceValue, targetValue, isEqual);
        case "concat":
          return sourceValue.concat(targetValue);
        case "replace":
          return targetValue;
        default:
          throw new Error(
            `Unknown merge array strategy: ${mergeArrays as string}`
          );
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
}

// 下载log文件
export function downloadLogFile(obj: any, name: string, suffix: any) {
  // console.log(obj, name, suffix);
  const url = URL.createObjectURL(
    new Blob([obj], { type: "application/force-download;charset=utf-8" })
  );
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  // link.setAttribute('download', fileName)
  link.download = name + "." + suffix;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadFile(obj: string, name: string, suffix: string) {
  const url = URL.createObjectURL(
    new Blob([obj], { type: "application/vnd.ms-excel;charset=utf-8" })
  );
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  const fileName = name + "." + suffix;
  // link.setAttribute('download', fileName)
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // }
}

export function timestampToTime(timestamp: number) {
  // 时间戳为10位需*1000，时间戳为13位不需乘1000
  const date = new Date(timestamp);
  const Y = date.getFullYear() + "-";
  const M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  const D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  const h = date.getHours() + ":";
  const m = date.getMinutes() + ":";
  const s = date.getSeconds();
  return Y + M + D + h + m + s;
}

//替换属性id相同的项
export function replaceId(dataObj: any, targetId: string, newItem: any) {
  Object.keys(dataObj).forEach(key => {
    if (dataObj[key].id === targetId) {
      dataObj[key] = newItem;
    }
  });
}

export function findObjectById(array: any, targetId: string) {
  return array.find(item => item.id === targetId);
}

export function cutStr(str: string, len: number) {
  let strLength = 0;
  let strLen = 0;
  let strCut = String();
  strLen = str.length;
  for (let i = 0; i < strLen; i++) {
    const a = str.charAt(i);
    // 遇到字符串中的<em>，跳过
    if (a === "<") {
      if (i + 3 < strLen && str.substring(i, i + 4) === "<em>") {
        i += 3;
        strCut = strCut.concat("<em>");
        continue;
      }
      if (i + 4 < strLen && str.substring(i, i + 5) === "</em>") {
        i += 4;
        strCut = strCut.concat("</em>");
        continue;
      }
    }
    strLength++;
    if (escape(a).length > 4) {
      // 中文字符的长度经编码之后大于4
      strLength++;
    }
    if (strLength > len) {
      strCut = strCut.concat("...");
      return strCut;
    } else {
      strCut = strCut.concat(a);
    }
  }
  // 如果给定字符串小于指定长度，则返回源字符串；
  if (strLength <= len) {
    return str;
  }
}

export function replaceItem(list, cur) {
  const result = findObjectById(list, cur.id);
  if (result) {
    //  替换属性id相同的项
    replaceId(list, cur.id, cur);
  } else {
    list.push(cur);
  }
  // console.log("list", list);
  return list;
}

export function objectToQueryString(obj) {
  // 使用 Object.entries() 来获取对象的键值对数组
  return (
    Object.entries(obj)
      // 对每一对键值进行处理，将其转换为 "key=\"value\"" 的格式
      .map(([key, value]) => `${key}="${value}"`)
      // 将所有处理后的字符串通过 " and " 连接起来
      .join(" and ")
  );
}
export function objectToLikeQuery(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `${key} like '%${value}%'`)
    .join(" and ");
}

export const deepClone = (source: any) => {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments");
  }
  const targetObj: any = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
};

// 下载csv文件
export const downloadcsvFile = (obj: any, name: string, suffix: any) => {
  const navigatorAny: any = window.navigator;
  if (navigatorAny.msSaveBlob) {
    const fileName = name + "." + suffix;
    try {
      navigatorAny.msSaveBlob(new Blob([obj]), fileName);
    } catch (e) {
      console.log(e);
    }
  } else {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", obj], { type: "text/csv" })
    );
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    const fileName = name + "." + suffix;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
