<script setup lang="ts">
import "animate.css";
// 引入 src/components/ReIcon/src/offlineIcon.ts 文件中所有使用addIcon添加过的本地图标
import "@/components/ReIcon/src/offlineIcon";
import { setType } from "./types";
import { useLayout } from "./hooks/useLayout";
import { useResizeObserver } from "@vueuse/core";
import { useAppStoreHook } from "@/store/modules/app";
import { deviceDetection, useDark, useGlobal } from "@pureadmin/utils";
import {
  computed,
  defineComponent,
  h,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
} from "vue";

import navbar from "./components/navbar.vue";
import tag from "./components/tag/index.vue";
import appMain from "./components/appMain.vue";
import Horizontal from "./components/sidebar/horizontal.vue";

const appWrapperRef = ref();
const fixedHeader = ref(true);
const { isDark } = useDark();
const { layout } = useLayout();
const isMobile = deviceDetection();
const { $storage } = useGlobal<GlobalPropertiesApi>();

const set: setType = reactive({
  sidebar: computed(() => {
    return useAppStoreHook().sidebar;
  }),

  device: computed(() => {
    return useAppStoreHook().device;
  }),

  classes: computed(() => {
    return {
      hideSidebar: !set.sidebar.opened,
      openSidebar: set.sidebar.opened,
      withoutAnimation: set.sidebar.withoutAnimation,
      mobile: set.device === "mobile",
    };
  }),

  hideTabs: computed(() => {
    return $storage?.configure.hideTabs;
  }),
});

function setTheme(layoutModel: string) {
  window.document.body.setAttribute("layout", layoutModel);
  $storage.layout = {
    layout: "horizontal",
    theme: $storage.layout?.theme,
    sidebarStatus: $storage.layout?.sidebarStatus,
    epThemeColor: $storage.layout?.epThemeColor,
  };
}

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize");
}

// 判断是否可自动关闭菜单栏
let isAutoCloseSidebar = true;

useResizeObserver(appWrapperRef, (entries) => {
  if (isMobile) return;
  const entry = entries[0];
  const { width } = entry.contentRect;
  width <= 760 ? setTheme("vertical") : setTheme(useAppStoreHook().layout);
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle("desktop", false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990 && !set.sidebar.isClickCollapse) {
    toggle("desktop", true);
    isAutoCloseSidebar = true;
  } else {
    toggle("desktop", false);
    isAutoCloseSidebar = false;
  }
});

onMounted(() => {
  if (isMobile) {
    toggle("mobile", false);
  }
});

onBeforeMount(() => {});

const layoutHeader = defineComponent({
  render() {
    return h(
      "div",
      {
        class: { "fixed-header": fixedHeader },
        style: [
          set.hideTabs && layout.value.includes("horizontal")
            ? isDark.value
              ? "box-shadow: 0 1px 4px #0d0d0d"
              : "box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08)"
            : "",
        ],
      },
      {
        default: () => [
          layout.value.includes("vertical") || layout.value.includes("mix")
            ? h(navbar)
            : null,
          layout.value.includes("horizontal") ? h(Horizontal) : null,
          h(tag),
        ],
      },
    );
  },
});
</script>

<template>
  <div ref="appWrapperRef" :class="['app-wrapper', set.classes]">
    <div class="main-container">
      <layout-header />
      <!-- 主体内容 -->
      <app-main :fixed-header="fixedHeader" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .main-container {
    height: calc(100% - 60px);
  }

  &::after {
    display: table;
    clear: both;
    content: "";
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.app-mask {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
}

.re-screen {
  margin-top: 12px;
}
</style>
