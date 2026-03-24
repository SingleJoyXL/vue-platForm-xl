<script setup lang="ts">
import SidebarItem from "./sidebarItem.vue";
import { isAllEmpty } from "@pureadmin/utils";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useNav } from "@/layout/hooks/useNav";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";
import personalCenter from "@/assets/svg/personalCenter.svg?component";
import back from "@/assets/svg/back.svg?component";
import close from "@/assets/svg/close.svg?component";
import shortcut from "@/assets/svg/shortcut.svg?component";
import {
  getAvatarSystemModule,
  getPublicConfig,
  logDownloadDevice
} from "@/api/base";
import { downloadLogFile } from "@/utils";
import choose from "./choose.vue";
import { useMessage } from "@/utils/message";
import rightMenuNav from "./rightMenuNav.vue";
import { getPlatform } from "@/utils/menu";
import projectList from "./projectList.vue";
const { createConfirmModal } = useMessage();

const menuRef = ref();

const { route, title, logout, backTopMenu } = useNav();

const defaultActive = computed(() =>
  !isAllEmpty(route.meta?.activePath) ? route.meta.activePath : route.path
);

const menuType = ref("");
const logoUrl = ref("");

async function GetAvatarLogoRedirectUrl() {
  await getPublicConfig("LOGO_REDIRECT_URL").then((res: any) => {
    logoUrl.value = res.data || "/#/choose_new";
  });
}

nextTick(async () => {
  menuType.value = await getPlatform();
  await GetAvatarLogoRedirectUrl();
  menuRef.value?.handleResize();
});

const nowDate = ref("");

const componentList = reactive({
  default: [],
  value: []
});

function Jump() {
  window.location.href = logoUrl.value;
}

function toHome() {
  backTopMenu();
}

function logDownload() {
  logDownloadDevice().then((res: any) => {
    downloadLogFile(res, "dataAssetService", "zip");
  });
}

function handleCommand(command: string) {
  window.open(`${window.origin}${command}`);
}
function updateComponentList(data: any) {
  componentList.value = data;
}
function currentTime() {
  setInterval(formatDate, 500);
}

function formatDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const weekArr = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  const hour = date.getHours();
  const hourStr = hour < 10 ? "0" + hour : hour;
  const minute = date.getMinutes();
  const minuteStr = minute < 10 ? "0" + minute : minute;
  const second = date.getSeconds();
  const secondStr = second < 10 ? "0" + second : second;
  nowDate.value = `${year}-${month}-${day},${hourStr}:${minuteStr}:${secondStr},${weekArr[week]}`;
}

onMounted(() => {
  currentTime();
  document.body.addEventListener("mousedown", (e: any) => {
    // 用click无法判断svg
    if (!menuType.value) {
      const verticalEl = document.getElementsByClassName("el-menu--horizontal");
      let clickOutSide = true;
      for (const n in verticalEl) {
        if (
          verticalEl[n] instanceof HTMLElement &&
          verticalEl[n].contains(e.target)
        ) {
          clickOutSide = false;
        }
      }
      if (clickOutSide) {
        setTimeout(() => {
          /*
            showMenuPath.value通过showMenu()改变，showMenu()由mouseover触发修改为click触发
            避免鼠标移动导致showMenuPath.value改变，从而菜单关闭不了
          */
          if (showMenuPath.value && menuRef.value)
            menuRef.value.close(showMenuPath.value);
        }, 300);
      }
    }
  });
  getSystemModule();
});

function getSystemModule() {
  getAvatarSystemModule().then((res: any) => {
    if (res.statusCode === 0) {
      if (res.data && Array.isArray(res.data) && res.data.length) {
        res.data = (res.data[0].paramValue || "")
          .split(";")
          .flatMap((item: string) => {
            const [name, url] = item.split(":");
            return name && url ? { name, url } : [];
          });
      } else {
        res.data = [];
      }
    }
    componentList.default = res.data.filter(
      (item: { url: string }) => item.url !== "/dataAssets/"
    );
  });
}

function closeMenu(path: string) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(path)) return;
  menuRef.value.close(path);
}

const showMenuPath = ref("");

function showMenu(path: string) {
  const httpReg = /^http(s?):\/\//;
  if (httpReg.test(path)) {
    showMenuPath.value = "";
    return;
  }
  setTimeout(() => {
    const menus = usePermissionStoreHook().wholeMenus;
    const topRoute = menus.find((item: any) => item.path === path);
    const hasSubmenu =
      topRoute &&
      Array.isArray(topRoute.children) &&
      (topRoute.children.length > 1 ||
        (topRoute.children.length === 1 &&
          topRoute.children[0]?.meta?.showParent === true));
    if (hasSubmenu) {
      menuRef.value?.close(path);
      if (menuRef.value?.open) {
        menuRef.value.open(path);
      }
      showMenuPath.value = path;
    } else {
      showMenuPath.value = "";
    }
  }, 0);
}

function open() {
  createConfirmModal("系统提示", "确定注销并退出系统吗？", "确定", "取消").then(
    type => {
      if (type === "confirm") {
        logout();
      }
    }
  );
}
</script>

<template>
  <div
    v-loading="usePermissionStoreHook().wholeMenus.length === 0"
    class="horizontal-header"
    :class="menuType"
  >
    <div class="horizontal-header-left">
      <img src="/logo.png" alt="logo" @click="Jump" />
      <span v-if="!menuType" @click="toHome">{{ title }}</span>
    </div>
    <el-menu
      v-if="!menuType"
      ref="menuRef"
      router
      mode="horizontal"
      class="horizontal-header-menu"
      :default-active="defaultActive"
      :unique-opened="true"
    >
      <sidebar-item
        v-for="route in usePermissionStoreHook().wholeMenus"
        :key="route.path"
        :item="route"
        :base-path="route.path"
        @closeMenu="closeMenu"
        @click="showMenu(route.path)"
      />
    </el-menu>
    <div class="horizontal-header-right">
      <div class="right-menu-blue">
        <project-list v-if="menuType" />
        <!-- <div v-if="menuType" class="title" @click="toHome">
          {{ title }}
        </div> -->
        <div class="icon-list">
          <span
            style="
              padding: 10px 0;
              position: relative;
              top: 1px;
              font-size: 18px;
            "
            @dblclick="logDownload()"
            ><span
              >{{ nowDate.split(",")[0] }} {{ nowDate.split(",")[1] }}</span
            ></span
          >
          <span>
            <el-tooltip
              class="set-icon navbar-bg-hover"
              :content="`用户名：${useUserStoreHook().username}`"
            >
              <personalCenter
                style="fill: #fff; height: 20px"
                @dblclick="logDownload()"
              />
            </el-tooltip>
          </span>
          <span>
            <el-tooltip class="set-icon navbar-bg-hover" content="返回主页">
              <back style="fill: #fff; height: 20px" @click="Jump" />
            </el-tooltip>
          </span>
          <span>
            <el-tooltip class="set-icon navbar-bg-hover" content="退出系统">
              <close
                style="fill: #fff; height: 20px; width: 20px"
                @click="open"
              />
            </el-tooltip>
          </span>
        </div>
      </div>
      <div class="right-menu-nav">
        <right-menu-nav
          v-if="menuType && usePermissionStoreHook().wholeMenus.length !== 0"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-loading-mask) {
  opacity: 0.45;
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}

.horizontal-header.changdian {
  height: 100px;
  justify-content: space-between;
  background-image: url(../../../assets/images/header.png);
  background-size: auto 100%;
  background-size: 100% 100%;

  .horizontal-header-left {
    width: 350px;
    padding-left: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .horizontal-header-right {
    width: calc(100% - 350px);
    display: block;
    padding-left: 30px;

    .right-menu-blue {
      height: 55px;
      display: flex;
      justify-content: space-between;

      .title {
        letter-spacing: 2px;
        font-size: 24px;
        font-family: STYuanti-SC-Bold, serif;
        cursor: pointer;
        padding-left: 40px;
        color: #fff;

        &::before {
          display: block;
          content: "";
          width: 0;
          height: 0;
          border-left: 5px solid #76caff;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          position: relative;
          right: 17px;
          top: 24px;
        }
      }

      .icon-list {
        display: flex;
        align-items: center;

        span {
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
