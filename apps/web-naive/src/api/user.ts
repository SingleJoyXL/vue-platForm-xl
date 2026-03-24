import { defHttp } from "#/utils/http";

enum Api {
  Login = "/dataAssetService/service/user/login",
  Logout = "/logout",
  getCurrentUser = "/avatar/sys/userrole/getCurrentUser"
}

export type UserResult = {
  /** 用户ID */
  id: string;
  /** `token` */
  token: string;
  /** `用户名` */
  username: string;
  /** `用户显示名称` */
  fullname: string;
  /** `是否激活` */
  active: number;
  /** `角色列表` */
  roles: string[];
};

type AvatarUser = {
  userId: string;
  userName: string;
  fullName: string;
  active: number;
  roles: string[];
};

type AvatarUserResult = {
  statusCode: number;
  repMessage: string;
  data: AvatarUser;
};

/** 登录 */
export const getLogin = (params?: object) => {
  return defHttp.post(
    {
      url: Api.Login,
      params
    },
    {
      errorMessageMode: "modal",
      successMessageMode: "modal",
      successMessage: "登录成功"
    }
  );
};

export const getCurrentUser = () => {
  return defHttp.post<AvatarUserResult>(
    {
      url: Api.getCurrentUser
    },
    {
      isTransformResponse: false
    }
  );
};
