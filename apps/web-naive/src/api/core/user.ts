

import { defHttp } from "@/utils/http";

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return defHttp.get('/user/info');
}
