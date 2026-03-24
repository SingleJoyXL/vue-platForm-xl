import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { UserResult } from "@/api/user";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo {
  /** token */
  token: string;
  /** `用户ID */
  id: string;
  /** 用户名 */
  username?: string;
  /** 显示名 */
  fullname?: string;
  /** 当前登陆用户的角色 */
  roles?: Array<string>;
}

export const sessionKey = "user-info";
export const TokenKey = "authorization";

/** 获取`token` */
export function getToken(): DataInfo {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(userInfo: UserResult) {
  const { token } = userInfo;
  if (token) {
    Cookies.set(TokenKey, token);
  }

  function setSessionKey(
    id: string,
    username: string,
    fullname: string,
    roles: Array<string>
  ) {
    useUserStoreHook().SET_ID(id);
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_FULLNAME(fullname);
    useUserStoreHook().SET_ROLES(roles);
    storageSession().setItem(sessionKey, {
      token,
      id,
      username,
      roles
    });
  }

  if (userInfo.username && userInfo.roles) {
    const { id, username, fullname, roles } = userInfo;
    setSessionKey(id, username, fullname, roles);
  } else {
    const id = storageSession().getItem<DataInfo>(sessionKey)?.id ?? "";
    const username =
      storageSession().getItem<DataInfo>(sessionKey)?.username ?? "";
    const roles = storageSession().getItem<DataInfo>(sessionKey)?.roles ?? [];
    const fullname =
      storageSession().getItem<DataInfo>(sessionKey)?.fullname ?? "";
    setSessionKey(id, username, fullname, roles);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}
