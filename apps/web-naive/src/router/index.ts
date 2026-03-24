import { getConfig } from "#/config";
import NProgress from "#/utils/progress";
import { sessionKey, type DataInfo } from "#/utils/auth";
import { useMultiTagsStoreHook } from "#/store/modules/multiTags";
import { usePermissionStoreHook } from "#/store/modules/permission";
import {
  type Router,
  createRouter,
  type RouteRecordRaw,
  type RouteComponent
} from "vue-router";
import {
  ascending,
  getTopMenu,
  initRouter,
  isOneOfArray,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import { buildHierarchyTree } from "#/utils/tree";
import { isUrl, openLink, storageSession, isAllEmpty } from "@pureadmin/utils";

import remainingRouter from "./modules/remaining";
import { getCurrentUser } from "#/api/user";
import type { UserResult } from "#/api/user";
import { setToken } from "#/utils/auth";
import { useUserStoreHook } from "#/store/modules/user";

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  {
    eager: true
  }
);

/** 原始静态路由（未做任何处理） */
const routes = [];

Object.keys(modules).forEach(key => {
  routes.push(modules[key].default);
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(
  routes.flat(Infinity)
).concat(...remainingRouter);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(
          buildHierarchyTree(ascending(routes.flat(Infinity)))
        )
      );
    }
  });
  usePermissionStoreHook().clearAllCachePage();
}

/** 路由白名单 */
const whiteList = ["/login"];

const { VITE_HIDE_HOME } = import.meta.env;

let isCheckingUser = false;

function normalizePath(path?: string) {
  if (!path) return "";
  return path.startsWith("/") ? path : `/${path}`;
}

function resolveChildPath(parentPath: string, childPath?: string) {
  if (!childPath) return normalizePath(parentPath);
  if (childPath.startsWith("/")) return childPath;
  const base = parentPath.replace(/\/+$/, "");
  const child = childPath.replace(/^\/+/, "");
  return `${base}/${child}`;
}

router.beforeEach((to: any, _from, next) => {
  const rootChildren = (router.options.routes?.[0]?.children ?? []) as any[];
  if (to.meta?.keepAlive) {
    handleAliveRoute(to, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(to);
    }
  }
  const userInfo = storageSession().getItem<DataInfo>(sessionKey);
  NProgress.start();
  if (!useUserStoreHook().url) {
    useUserStoreHook().GetAvatarUrl();
    useUserStoreHook().GetAvatarRedirectUrl();
  }
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title) document.title = `${item.meta.title} | ${Title}`;
      else document.title = item.meta.title as string;
    });
  }
  const maybeDir = findRouteByPath(
    to.path,
    rootChildren
  );
  if (
    maybeDir &&
    Array.isArray(maybeDir.children) &&
    maybeDir.children.length > 0
  ) {
    const isDirectory = !!maybeDir.meta?.backstage || !maybeDir.component;
    if (isDirectory && to.path === maybeDir.path) {
      const redirectPath = normalizePath(maybeDir.redirect as string);
      const fallbackChild = maybeDir.children.find((cur: any) => {
        const fullChildPath = resolveChildPath(maybeDir.path, cur?.path);
        return fullChildPath && fullChildPath !== to.path;
      });
      const target =
        (redirectPath &&
          maybeDir.children.find(
            (cur: any) => resolveChildPath(maybeDir.path, cur?.path) === redirectPath
          )) ||
        fallbackChild;
      const targetPath = target
        ? resolveChildPath(maybeDir.path, target.path)
        : "";
      if (targetPath && targetPath !== to.path) {
        next({ path: targetPath, replace: true });
        NProgress.done();
        return;
      }
    }
  }
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
  }
  if (userInfo) {
    // 无权限跳转403页面
    if (to.meta?.roles && !isOneOfArray(to.meta?.roles, userInfo?.roles)) {
      return next({ path: "/error/403" });
    }
    // 开启隐藏首页后在浏览器地址栏手动输入首页welcome路由则跳转到404页面
    if (VITE_HIDE_HOME === "true" && to.fullPath === "/welcome") {
      return next({ path: "/error/404" });
    }
    if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
        return next(false);
      } else {
        return toCorrectRoute();
      }
    } else {
      // 刷新
      if (
        usePermissionStoreHook().wholeMenus.length === 0 &&
        to.path !== "/login"
      ) {
        return initRouter().then((router: Router) => {
          const currentRootChildren = (router.options.routes?.[0]?.children ??
            []) as any[];
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const { path } = to;
            const route = findRouteByPath(path, currentRootChildren);
            getTopMenu(true);
            // query、params模式路由传参数的标签页不在此处处理
            if (route && route.meta?.title) {
              if (isAllEmpty(route.parentId) && route.meta?.backstage) {
                // 此处为动态顶级路由（目录）
                const { path, name, meta } = route.children[0];
                useMultiTagsStoreHook().handleTags("push", {
                  path,
                  name,
                  meta
                });
              } else {
                const { path, name, meta } = route;
                useMultiTagsStoreHook().handleTags("push", {
                  path,
                  name,
                  meta
                });
              }
            }
          }

          // 确保动态路由被添加到标签页
          if (to.meta?.backstage && to.meta?.title) {
            const multiTags = useMultiTagsStoreHook().multiTags;
            const hasTag =
              Array.isArray(multiTags) &&
              multiTags.some((tag: any) => tag.name === to.name);
            if (!hasTag) {
              useMultiTagsStoreHook().handleTags("push", {
                path: to.path,
                name: to.name,
                meta: to.meta
              });
            }
          }
          // 动态路由初始化后再次校验目标路由，避免对同一路径反复 replace 导致死循环
          if (isAllEmpty(to.name)) {
            const resolved = router.resolve(to.fullPath);
            if (isAllEmpty(resolved?.name)) {
              const topMenuPath = getTopMenu(true)?.path;
              if (topMenuPath && topMenuPath !== to.path) {
                return next({ path: topMenuPath, replace: true });
              }
              return next({ path: "/error/404", replace: true });
            }
            return next({ path: to.fullPath, replace: true });
          }
          return toCorrectRoute();
        });
      }
      return toCorrectRoute();
    }
  } else {
    if (!isCheckingUser) {
      isCheckingUser = true;
      if (to.path !== "/login") {
        getCurrentUser()
          .then(res => {
            if (res.statusCode === 0) {
              const userResult = {
                id: res.data.userId,
                token: "",
                username: res.data.userName,
                fullname: res.data.fullName,
                active: res.data.active,
                roles: res.data.roles
              } as UserResult;
              setToken(userResult);
              return initRouter().then(() => {
                isCheckingUser = false;
                if (to.fullPath) {
                  return next({ path: to.fullPath, replace: true });
                } else {
                  return next({ path: getTopMenu(true).path, replace: true });
                }
              });
            } else {
              isCheckingUser = false;
              if (whiteList.indexOf(to.path) !== -1) {
                return next();
              } else {
                if (process.env.NODE_ENV === "development") {
                  return next({ path: "/login" });
                } else {
                  if (window !== top) {
                    window.top.location.href = useUserStoreHook().redirectUrl
                      ? useUserStoreHook().redirectUrl
                      : useUserStoreHook().url;
                  } else {
                    window.location.href = useUserStoreHook().redirectUrl
                      ? useUserStoreHook().redirectUrl
                      : useUserStoreHook().url;
                  }
                }
              }
            }
          })
          .catch(() => {
            isCheckingUser = false;
            if (whiteList.indexOf(to.path) !== -1) {
              return next();
            } else {
              if (process.env.NODE_ENV === "development") {
                return next({ path: "/login" });
              } else {
                if (window !== top) {
                  window.top.location.href = useUserStoreHook().redirectUrl
                    ? useUserStoreHook().redirectUrl
                    : useUserStoreHook().url;
                } else {
                  window.location.href = useUserStoreHook().redirectUrl
                    ? useUserStoreHook().redirectUrl
                    : useUserStoreHook().url;
                }
              }
            }
          });
      } else {
        isCheckingUser = false;
        return next();
      }
    } else {
      return next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
