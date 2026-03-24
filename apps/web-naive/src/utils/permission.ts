import { useUserStoreHook } from "@/store/modules/user";
import { queryGlobalAccessAuth } from "@/api/base";
import Cookies from "js-cookie";
export const checkPermission = (value: string[]): boolean => {
  if (value && value.length > 0) {
    const roles = useUserStoreHook().roles;
    const permissionRoles = value;
    return roles.some(role => {
      return permissionRoles.includes(role);
    });
  } else {
    console.error("need roles! Like v-permission=\"['admin','editor']\"");
    return false;
  }
};

export const checkGlobalAccessAuth = async () => {
  const permissionsList = {
    edit: false,
    view: true
  };
  await queryGlobalAccessAuth().then(res => {
    if (res?.data) {
      Cookies.set("globalPermission", JSON.stringify(res.data));
      if (res.data.WRITE) {
        // 编辑权限
        permissionsList.edit = true;
      }
      if (res.data.READ || res.data.WRITE) {
        // 访问权限
        permissionsList.view = true;
      }
      if (!res.data.READ && !res.data.WRITE) {
        // 无权限
        permissionsList.edit = false;
        permissionsList.view = false;
      }
    }
  });
  return permissionsList;
};
