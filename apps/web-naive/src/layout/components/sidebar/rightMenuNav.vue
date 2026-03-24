<script setup lang="ts">
import {
  ref,
  reactive,
  nextTick,
  watch,
  computed,
  getCurrentInstance,
  onMounted,
} from "vue";
import { isAllEmpty } from "@pureadmin/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const fullPath = ref("");
const currentSubNavPath = ref("");

watch(
  useRoute(),
  (value: any) => {
    fullPath.value = value.fullPath;
  },
  { immediate: true },
);

const defaultActive = computed(() =>
  !isAllEmpty(useRoute().meta?.activePath)
    ? useRoute().meta.activePath
    : useRoute().path,
);

function setClassMenu(index: number, length: number, path: string) {
  const updown = index % 2 === 1 ? "up" : "down";
  if (useRoute().meta.affix) {
    if (fullPath.value === "/" + path) {
      return `menu-item active active-${updown}-${length}`;
    } else if (currentSubNavPath.value.indexOf(path) !== -1) {
      return `menu-item on on-${updown}-${length}`;
    } else {
      return `menu-item off-${updown}-${length}`;
    }
  } else {
    if (fullPath.value.indexOf(path) !== -1) {
      return `menu-item active active-${updown}-${length}`;
    } else if (currentSubNavPath.value.indexOf(path) !== -1) {
      return `menu-item on on-${updown}-${length}`;
    } else {
      return `menu-item off-${updown}-${length}`;
    }
  }
}

const oneShow = ref(false);
const twoShow = ref(false);
const navListOne = ref("");
const navListTwo = ref("");

function routeClick(route: any, index: any) {
  twoShow.value = false;
  if (!route.children) {
    // 直接跳转
    oneShow.value = false;
    currentSubNavPath.value = "";
    fullPath.value = `${route.path}`;
    proxy.$router.push({ path: `${route.path}` });
  } else {
    currentSubNavPath.value = route.path;
    navListOne.value = route.children;
    if (oneShow.value === index) {
      oneShow.value = false;
      twoShow.value = false;
    } else {
      oneShow.value = index;
    }
    route.children.forEach((item: any, index: any) => {
      if (item.children && fullPath.value.indexOf(item.path) !== -1) {
        navListTwo.value = item.children;
        twoShow.value = index;
      }
    });
  }
}

const navList = reactive([]);

function dealNavList() {
  if (
    usePermissionStoreHook().wholeMenus &&
    usePermissionStoreHook().wholeMenus.length > 0
  ) {
    usePermissionStoreHook().wholeMenus.forEach((item: any) => {
      if (item.meta && !item.meta.hidden) {
        if (item.children && hasOneShowingChild(item.children)) {
          const data = item.children[0];
          if (data.name !== "Dashboard" && data.path.indexOf("/") === -1) {
            data.path = `${item.path.slice(1)}/${data.path}`;
          }
          data.show = false;
          navList.push(data);
        } else if (item.meta && item.meta.title) {
          item.show = false;
          navList.push(item);
        }
      }
    });
  }
}

nextTick(() => {
  setTimeout(() => {
    dealNavList();
  }, 0);
});

function hasOneShowingChild(children = []) {
  const showingChildren = children.filter((item: any) => {
    return !item.meta.hidden;
  });
  if (showingChildren.length === 1) {
    return true;
  }
  return showingChildren.length === 0;
}

const popoveraite = ref(null);
function selectMenu(route: any) {
  popoveraite.value.forEach((item: any) => {
    console.log(item);
    item.hide();
  });
}

const showMenuPath = ref("");

watch(
  showMenuPath,
  (newVal: any, oldVal: any) => {
    navList.forEach((item: any) => {
      if (item.path === oldVal) {
        item.show = false;
      }
    });
  },
  { deep: true },
);

function showMenu(route: any) {
  route.show = false;
  setTimeout(() => {
    route.show = true;
  }, 0);
  showMenuPath.value = route.path;
}

onMounted(() => {
  document.body.addEventListener("click", (e: any) => {
    const verticalEl = document.getElementsByClassName("menu");
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
      navList.forEach((item: any) => {
        if (item.path === showMenuPath.value) {
          item.show = false;
        }
      });
    }
  });
});
</script>

<template>
  <div class="right-menu-nav-wrap">
    <!-- 背景 -->
    <div class="menu-background" />
    <div class="menu-bottom">
      <div
        v-for="(route, index) in navList"
        :key="route.path"
        :class="setClassMenu(index, route.meta.title.length, route.path)"
        @click.stop="routeClick(route, index)"
      >
        <div v-if="!route.children || route.children.length === 0">
          {{ route.meta.title }}
        </div>
        <el-popover
          v-else
          ref="popoveraite"
          popper-class="menu"
          placement="bottom-start"
          :width="210"
          trigger="hover"
        >
          <template #reference>
            <div @mouseover="showMenu(route)">
              {{ route.meta.title }}
            </div>
          </template>
          <el-menu
            router
            class="el-menu-vertical"
            :default-active="defaultActive"
            @select="selectMenu(route)"
          >
            <span
              v-for="(item, i) in route.children"
              v-show="!item.meta.hidden"
              :key="i"
            >
              <el-menu-item
                v-if="!item.children || item.children.length === 0"
                :index="item.path"
              >
                {{ item.meta.title }}
              </el-menu-item>
              <el-sub-menu v-else class="nav-item" :index="item.path">
                <template #title>{{ item.meta.title }}</template>
                <el-menu-item-group
                  v-for="child in item.children"
                  :key="child.path"
                  class="nav-item"
                  :index="child.path"
                >
                  <el-menu-item :index="child.path">
                    {{ child.meta.title }}
                  </el-menu-item>
                </el-menu-item-group>
              </el-sub-menu>
            </span>
          </el-menu>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right-menu-nav-wrap {
  height: 45px;
  line-height: normal;
  position: relative;
  .menu-background {
    height: 45px;
    width: calc(100% - 30px);
    background-blend-mode: normal, normal;
    background-image: linear-gradient(0deg, #d5d4ca, #edede9);
    position: absolute;
    right: 0;
  }
  .menu-bottom {
    height: 45px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 30px;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
    position: relative;
    > div {
      cursor: pointer;
    }
    .menu-item {
      position: relative;
      height: 45px;
      line-height: 45px;
      padding-right: 67px;
      font-size: 20px;
      font-family: Alibaba-PuHuiTi-M;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 2px;
      color: #000000;
      &::after {
        display: block;
        content: "";
        width: 64px;
        height: 45px;
        background: url(../../../assets/images/menu/among2.png) no-repeat;
        position: absolute;
        top: 0;
        left: -64px;
      }
      &:nth-of-type(1) {
        &::after {
          background: url(../../../assets/images/menu/first2.png) no-repeat;
        }
      }
      &.active {
        background: linear-gradient(0deg, #edece3, #fff);
        &:nth-of-type(1) {
          &::after {
            background: url(../../../assets/images/menu/first.png) no-repeat;
          }
        }
        &::after {
          background: url(../../../assets/images/menu/among.png) no-repeat;
        }
        & + .menu-item::after {
          background: url(../../../assets/images/menu/end.png) no-repeat;
        }
        & + .menu-item:hover:after {
          background: url(../../../assets/images/menu/hover.png) no-repeat;
        }
      }
      &:nth-last-of-type(1) {
        background: url(../../../assets/images/menu/among2.png) no-repeat right;
        &.active {
          background:
            url(../../../assets/images/menu/end.png) no-repeat right,
            linear-gradient(0deg, #edece3, #fff);
        }
        &:hover {
          background:
            url(../../../assets/images/menu/end.png) no-repeat right,
            linear-gradient(0deg, #edece3, #fff);
        }
      }
      &.active {
        &::before {
          display: block;
          content: "";
          width: 6px;
          height: 6px;
          background: #2b4f96;
          position: absolute;
          top: 20px;
          left: -15px;
          z-index: 1;
        }
      }
      &:hover {
        background: linear-gradient(0deg, #edece3, #fff);
        &:nth-of-type(1) {
          &::after {
            background: url(../../../assets/images/menu/first.png) no-repeat;
          }
        }
        &::after {
          background: url(../../../assets/images/menu/among.png) no-repeat;
        }
        & + .menu-item {
          &.active::after {
            background: url(../../../assets/images/menu/hover2.png) no-repeat;
          }
          &::after {
            background: url(../../../assets/images/menu/end.png) no-repeat;
          }
        }
      }
      .menu-one {
        position: absolute;
        top: 56px;
        left: 20px;
        background-color: #ffffff;
        box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.23);
        border-radius: 6px;
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 1px;
        color: #14161f;
        &::before {
          display: block;
          content: "";
          width: 0px;
          height: 0px;
          border-bottom: 10px solid #fff;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          position: absolute;
          left: 28px;
          top: -10px;
        }
        .menu-one-list {
          cursor: pointer;
          .menu-one-list-content {
            height: 50px;
            width: 210px;
            display: flex;
            align-items: center;
            padding-left: 29px;
          }
          &:hover {
            background-color: #f7f9fb;
            &::before {
              display: block;
              content: "";
              height: 50px;
              width: 3px;
              background-color: #004892;
              position: absolute;
            }
          }
          &:nth-of-type(1):hover {
            border-radius: 6px 6px 0 0;
            &::before {
              border-radius: 6px 0 0 0;
            }
          }
          &:nth-last-of-type(1):hover {
            border-radius: 0 0 6px 6px;
            &::before {
              border-radius: 0 0 0 6px;
            }
          }
          &.active-item {
            background-color: #f7f9fb;
            &::before {
              display: block;
              content: "";
              height: 50px;
              width: 3px;
              background-color: #004892;
              position: absolute;
            }
          }
          &:nth-of-type(1).active-item {
            border-radius: 6px 6px 0 0;
            &::before {
              border-radius: 6px 0 0 0;
            }
          }
          &:nth-last-of-type(1).active-item {
            border-radius: 0 0 6px 6px;
            &::before {
              border-radius: 0 0 0 6px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
// el-sub-menu nav-item
.el-popover.menu {
  padding: 0 !important;
  background-color: #ffffff;
  box-shadow: 3px 3px 10px 0px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 1px;
  color: #14161f;
  &.item {
    margin-left: 65px;
  }
  // el-sub-menu is-active is-opened nav-item
  .el-menu-vertical {
    border-right: none;
    .el-sub-menu.nav-item.is-opened > .el-menu,
    .el-sub-menu.nav-item.is-opened {
      background-color: #f7f9fb;
    }
    .el-sub-menu.is-active .el-sub-menu__title svg,
    .el-menu-item.is-active,
    .el-sub-menu.nav-item.is-active .el-sub-menu__title {
      color: #14161f !important;
    }
    .el-menu-item.is-active {
      background-color: #deeaf8;
      &::before {
        display: block;
        content: "";
        height: 50px;
        width: 3px;
        background-color: #004892;
        position: absolute;
        left: 0;
      }
    }

    .el-sub-menu.nav-item .el-sub-menu__title {
      background-color: transparent;
      font-size: 18px;
      color: #14161f;
      &:hover {
        color: #14161f !important;
        background-color: #deeaf8;
        &::before {
          display: block;
          content: "";
          height: 50px;
          width: 3px;
          background-color: #004892;
          position: absolute;
          left: 0;
        }
      }
    }
    .el-menu-item-group__title {
      display: none;
    }
    .el-menu-item {
      background-color: transparent;
      font-size: 18px;
      color: #14161f;
      &:hover {
        color: #14161f !important;
        background-color: #deeaf8;
        &::before {
          display: block;
          content: "";
          height: 50px;
          width: 3px;
          background-color: #004892;
          position: absolute;
          left: 0;
        }
      }
    }
  }
  .menu-one-list {
    height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding-left: 29px;

    &:hover {
      background-color: #f7f9fb;
      &::before {
        display: block;
        content: "";
        height: 50px;
        width: 3px;
        background-color: #004892;
        position: absolute;
        left: 0;
      }
    }
    &:nth-of-type(1):hover {
      &::before {
        border-radius: 6px 0 0 0;
      }
    }
    &:nth-last-of-type(1):hover {
      // border: 1px solid #000;
      &::before {
        border-radius: 0 0 0 6px;
      }
    }
    &.active-item {
      background-color: #f7f9fb;
      &::before {
        display: block;
        content: "";
        height: 50px;
        width: 3px;
        background-color: #004892;
        position: absolute;
        left: 0;
      }
    }
  }
}
</style>
