import { defHttp } from "#/utils/http";

enum Api {
  logDownloadDevice = "/dataAssetService/service/baseService/logDownload",
  getPublicConfig = "/avatar/sys/sysConfig/getPublicConfig",
  listAll = "/portal-prod-api/ymh/ymhMenu/listMenu",
  getAvatarRedirectUrl = "/dataService/service/baseService/getAvatarRedirectUrl",
  getAvatarUrl = "/dataService/service/baseService/getAvatarUrl",
  getAvatarContext = "/dataService/service/baseService/getAvatarContext",
  getAvatarSystemModule = "/avatar/sys/sysConfig/queryByParamName?paramName=MENU_FAST_LINK",
  judgeAuthor = "/avatar/sys/author/judgeAuthor",
  queryGlobalAccessAuth = "/avatar/sys/userrole/queryGlobalAccessAuth",
}

export const logDownloadDevice = () => {
  return defHttp.get(
    {
      url: Api.logDownloadDevice,
      responseType: "blob"
    },
    {
      isTransformResponse: false
    }
  );
};

export const getPublicConfig = (param: string) => {
  return defHttp.get({
    url: Api.getPublicConfig,
    params: {
      module: "SYSTEM",
      param: param
    }
  });
};

export const listAll = () => {
  return defHttp.get(
    {
      url: Api.listAll
    },
    {
      isTransformResponse: false
    }
  );
};

export const getAvatarRedirectUrl = () => {
  return defHttp.get(
    {
      url: Api.getAvatarRedirectUrl
    },
    {
      isTransformResponse: false
    }
  );
};

export const getAvatarUrl = () => {
  return defHttp.get(
    {
      url: Api.getAvatarUrl
    },
    {
      isTransformResponse: false
    }
  );
};

export const getAvatarContext = () => {
  return defHttp.get(
    {
      url: Api.getAvatarContext
    },
    {
      isTransformResponse: false
    }
  );
};

export const getAvatarSystemModule = () => {
  return defHttp.post({
    url: Api.getAvatarSystemModule
  });
};



export const judgeAuthor = (data: { url: string; userId: string }) => {
  const formData = new FormData();
  formData.append("url", data.url);
  formData.append("userId", data.userId);
  return defHttp.post({
    url: Api.judgeAuthor,
    headers: { "content-type": "multipart/form-data" },
    data: formData
  });
};

export const queryGlobalAccessAuth = () => {
  return defHttp.post(
    {
      url: Api.queryGlobalAccessAuth
    },
    {
      errorMessageMode: "modal"
    }
  );
};

