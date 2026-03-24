import { defHttp } from "#/utils/http";

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

}

/**
 * 登录
 */
export async function loginApi(data: any) {
  return defHttp.post('/dataAssetService/service/user/login', data);
}

