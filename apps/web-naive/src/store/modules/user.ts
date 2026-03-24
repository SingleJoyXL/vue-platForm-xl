import { defineStore, getActivePinia } from "pinia";
import { store } from "#/store";
import { userType } from "./types";
import { routerArrays } from "#/layout/types";
import { router, resetRouter } from "#/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin ,UserResult} from "#/api/user";


import { type DataInfo, setToken, removeToken, sessionKey } from "#/utils/auth";
import {
  getAvatarRedirectUrl,
  getAvatarUrl,
  getAvatarContext
} from "#/api/base";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    //用户ID
    id: storageSession().getItem<DataInfo>(sessionKey)?.id ?? "",
    // 用户名
    username: storageSession().getItem<DataInfo>(sessionKey)?.username ?? "",
    // 显示名称
    fullname: storageSession().getItem<DataInfo>(sessionKey)?.fullname ?? "",
    // 角色列表
    roles: storageSession().getItem<DataInfo>(sessionKey)?.roles ?? [],
    url: "",
    redirectUrl: ""
  }),
  actions: {
    /** 存储ID */
    SET_ID(id: string) {
      this.id = id;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储显示名 */
    SET_FULLNAME(fullname: string) {
      this.fullname = fullname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    async GetAvatarRedirectUrl() {
      await getAvatarRedirectUrl().then((res: any) => {
        if (res.code === 200) {
          this.SET_REDIRECT_URL(res.data);
        }
      });
    },
    SET_REDIRECT_URL(redirectUrl: string) {
      this.redirectUrl = redirectUrl;
    },
    async GetAvatarUrl() {
      if (process.env.NODE_ENV === "development") {
        await getAvatarUrl().then((res: any) => {
          if (res.code === 200) {
            this.SET_URL(res.data);
          }
        });
      } else {
        await getAvatarContext().then((res: any) => {
          if (res.code === 200) {
            const host = `http://${window.location.host}${res.data}`;
            this.SET_URL(host);
          }
        });
      }
    },
    SET_URL(url: string) {
      this.url = url;
    },
    /** 登入 */
    async authLogin(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(res => {
            debugger
            setToken(res.data);
            resolve(res.data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      // useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      if (process.env.NODE_ENV === "development") {
        router.push("/login");
      } else {
        if (window !== top) {
          window.top.location.href = this.redirectUrl
            ? this.redirectUrl
            : this.url;
        } else {
          window.location.href = this.redirectUrl ? this.redirectUrl : this.url;
        }
      }
      // router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(getActivePinia() || store);
}
