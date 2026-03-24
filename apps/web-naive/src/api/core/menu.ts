import type {RouteRecordStringComponent} from '@vben/types';
import { defHttp } from "@/utils/http";

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return defHttp.get<RouteRecordStringComponent[]>('/menu/all');
}
