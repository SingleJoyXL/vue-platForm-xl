import { defHttp } from "#/utils/http";

enum Api {
  logDownloadDevice = "/dataAssetService/service/baseService/logDownload",
  getPublicConfig = "/avatar/sys/sysConfig/getPublicConfig",
  listAll = "/portal-prod-api/ymh/ymhMenu/listMenu",
  getAvatarRedirectUrl = "/dataService/service/baseService/getAvatarRedirectUrl",
  getAvatarUrl = "/dataService/service/baseService/getAvatarUrl",
  getAvatarContext = "/dataService/service/baseService/getAvatarContext",
  getAvatarSystemModule = "/avatar/sys/sysConfig/queryByParamName?paramName=MENU_FAST_LINK",
  getSiteByUsername = "/deviceObject/service/site/getSiteByUsername",
  getSiteByUsernameDerivation = "/dataAssetService/service/ObjectModelStruct/site/getSiteByUsername",
  getUUID = "/dataAssetService/service/baseService/getUUID",
  downloadSmallFile = "/avatar/ddaas/smallFile/downloadFile",
  getTaskTrace = "/workflowService/service/workFlow/operate/getTaskTrace",
  getProcess = "/avatar/industrialpipeline/startupparameter/mongo/get",
  getSubDeviceByStatus = "/deviceObject/service/device/getSubDeviceByStatus",
  getAvatarParam = "/avatar/sys/sysConfig/queryByParamName",
  judgeAuthor = "/avatar/sys/author/judgeAuthor",
  uploadTmpFile = "/avatar/ddaas/smallFile/uploadRelateFile?collectionName=smallFile&deviceNumberTag=smallFile&dirTag=",
  isAdmin = "/dataAssetService/service/dataAssetManage/asset/isAdmin",
  getUserList = "/dataAssetService/service/dataAssetManage/dataAssetMap/getUserListByName",
  queryGlobalAccessAuth = "/avatar/sys/userrole/queryGlobalAccessAuth",
  getAllRoles = "/dataAssetService/service/userService/getAllRoles",
  getAllOrganizations = "/dataAssetService/service/userService/getAllOrganizations",
  getAllUsers = "/dataAssetService/service/userService/getAllUsers",
  getBusinessKey = "/dataAssetService/service/ObjectModelStruct/getBusinessKey"
}

export const getUserList = (name: string) => {
  return defHttp.get(
    {
      url: `${Api.getUserList}?userName=${name}`
    },
    {
      errorMessageMode: "modal"
    }
  );
};
// 获取是否管理员
export const getAdmin = () => {
  return defHttp.post(
    {
      url: Api.isAdmin
    },
    {
      errorMessageMode: "modal"
    }
  );
};
// 上传文件
export const uploadTmpFile = (params: File, name: string) => {
  return defHttp.uploadFile(
    {
      url: Api.uploadTmpFile
    },
    {
      file: params,
      // filename: name,
      name: name // 可选，自定义表单字段名
    }
  );
};

export const getSubDeviceByStatus = (
  siteId: string,
  id: string,
  status: number
) => {
  return defHttp.get(
    {
      url: Api.getSubDeviceByStatus,
      params: {
        siteId,
        id,
        status
      }
    },
    {
      isTransformResponse: false
    }
  );
};
export const getProcess = (id: string) => {
  return defHttp.get(
    {
      url: `${Api.getProcess}?flowId=${id}`
    },
    {
      isTransformResponse: false
    }
  );
};
export const getUUID = () => {
  return defHttp.post({
    url: Api.getUUID
  });
};

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

export const getSiteByUsername = (username: string) => {
  return defHttp.get(
    {
      url: Api.getSiteByUsername,
      params: {
        username
      }
    },
    {
      isTransformResponse: false
    }
  );
};
export const getSiteByUsernameDerivation = (params: string) => {
  return defHttp.post(
    {
      url: Api.getSiteByUsernameDerivation,
      params
    },
    {
      errorMessageMode: "modal"
    }
  );
};

export const downloadSmallFile = (fileId: string) => {
  return defHttp.post(
    {
      url: `${Api.downloadSmallFile}?id=${fileId}`,
      responseType: "blob"
    },
    {
      isTransformResponse: false
    }
  );
};

export const getTaskTrace = (businessKey: string) => {
  return defHttp.get(
    {
      url: `${Api.getTaskTrace}?processDefinitionKey=dynamic_approve&businessKey=${businessKey}`
    },
    {
      isTransformResponse: false
    }
  );
};

export const getAvatarParam = (params: string) => {
  return defHttp.post(
    {
      url: `${Api.getAvatarParam}?paramName=${params}`
    },
    {
      errorMessageMode: "modal"
    }
  );
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

export const getAllRoles = (roleName: string, page: number, limit: number) => {
  return defHttp.post(
    {
      url: `${Api.getAllRoles}?roleName=${roleName}&page=${page}&limit=${limit}`
    },
    {
      errorMessageMode: "modal"
    }
  );
};

export const getAllOrganizations = (
  organizationName: string,
  page: number,
  limit: number
) => {
  return defHttp.post(
    {
      url: `${Api.getAllOrganizations}?organizationName=${organizationName}&page=${page}&limit=${limit}`
    },
    {
      errorMessageMode: "modal"
    }
  );
};

export const getAllUsers = (userName: string, page: number, limit: number) => {
  return defHttp.post(
    {
      url: `${Api.getAllUsers}?userName=${userName}&page=${page}&limit=${limit}`
    },
    {
      errorMessageMode: "modal"
    }
  );
};

// 获取业务key
export const getBusinessKey = (params: any) => {
  return defHttp.post(
    {
      url: Api.getBusinessKey,
      params
    },
    {
      errorMessageMode: "modal"
    }
  );
};
