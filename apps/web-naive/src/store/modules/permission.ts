import { defineStore } from "pinia";
import { store } from "@/store";
import { cacheType } from "./types";
import { constantMenus } from "@/router";
import { useMultiTagsStoreHook } from "./multiTags";
import { debounce, getKeyList } from "@pureadmin/utils";
import { ascending, filterTree, filterNoPermissionTree } from "@/router/utils";
import router from "@/router";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    /** 组装整体路由生成的菜单 */
    handleWholeMenus(routes: any[]) {
      this.wholeMenus = filterNoPermissionTree(
        filterTree(ascending(this.constantMenus.concat(routes)))
      );
    },
    cacheOperate({ mode, name }: cacheType) {
      const delIndex = this.cachePageList.findIndex(v => v === name);
      switch (mode) {
        case "refresh":
          this.cachePageList = this.cachePageList.filter(v => v !== name);
          break;
        case "add":
          if (delIndex === -1) {
            this.cachePageList.push(name);
          }
          break;
        case "delete":
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
      /** 监听缓存页面是否存在于标签页，不存在则删除（但保留动态路由） */
      debounce(() => {
        let cacheLength = this.cachePageList.length;
        const nameList = getKeyList(useMultiTagsStoreHook().multiTags, "name");
        while (cacheLength > 0) {
          const cacheName = this.cachePageList[cacheLength - 1];
          // 检查这个缓存的路由是否在标签页中，或者是否是动态路由（保持动态路由缓存）
          const route = router.getRoutes().find(r => r.name === cacheName);
          const shouldKeep = nameList.includes(cacheName) || route?.meta?.backstage;

          if (!shouldKeep) {
            this.cachePageList.splice(
              this.cachePageList.indexOf(cacheName),
              1
            );
          }
          cacheLength--;
        }
      })();
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
