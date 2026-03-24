<script setup lang="ts">
import { getCurrentInstance, onMounted } from "vue";
import shortcut from "@/assets/svg/shortcut.svg?component";
import { listAll } from "@/api/base";
import businessCenter from "@/assets/svg/businessCenter.svg?component";
import controlCenter from "@/assets/svg/controlCenter.svg?component";
import dataCenter from "@/assets/svg/dataCenter.svg?component";
import technicalCenter from "@/assets/svg/technicalCenter.svg?component";

const props = defineProps({
  componentList: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const emit = defineEmits(["updateComponentList", "handleCommand"]);

function getComponentList() {
  listAll().then((res: any) => {
    if (res.code === 200) {
      const result = [];
      Object.keys(res.data).forEach((d) => {
        result.push({
          label: d,
          icon:
            d === "技术中台"
              ? "technicalCenter"
              : d === "业务中台"
                ? "businessCenter"
                : d === "数据中台"
                  ? "dataCenter"
                  : "controlCenter",
          list: res.data[d].filter((el) => el.linkAuthFlag === 1),
        });
      });
      // props.componentList.value = result;
      emit("updateComponentList", result);
    }
  });
}

onMounted(() => {
  getComponentList();
});

const { proxy } = getCurrentInstance();

function handleCommand(link: string) {
  emit("handleCommand", link);
}
</script>

<template>
  <div class="choose">
    <shortcut style="fill: #fff; height: 20px" />
    <div class="choose-menu-wrapper">
      <div class="choose-menu">
        <div
          v-for="(item, index) in props.componentList.value"
          :key="index"
          class="choose-menu-item"
        >
          <div class="icon">
            <technicalCenter
              v-if="item.icon === 'technicalCenter'"
              style="fill: #729dbb; height: 24px"
            />
            <businessCenter
              v-if="item.icon === 'businessCenter'"
              style="fill: #729dbb; height: 24px"
            />
            <dataCenter
              v-if="item.icon === 'dataCenter'"
              style="fill: #729dbb; height: 24px"
            />
            <controlCenter
              v-if="item.icon === 'controlCenter'"
              style="fill: #729dbb; height: 24px"
            />
          </div>
          <div class="label">{{ item.label }}</div>
          <div v-show="item.list.length" class="choose-list-wrapper">
            <div class="menu-list">
              <div
                v-for="(el, i) in item.list"
                :key="i"
                class="menu-list-item"
                @click="handleCommand(el.link)"
              >
                {{ el.subitemName }}
              </div>
            </div>
            <div class="triangle" />
          </div>
        </div>
      </div>
      <div class="triangle" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.choose {
  position: relative;
  left: 0;
  top: 0;
  z-index: 999;

  &:hover {
    .choose-menu-wrapper {
      display: block;
    }
  }
}

.choose-menu-wrapper {
  padding-top: 20px;
  position: absolute;
  left: -150px;
  top: 20px;
  display: none;

  .choose-menu {
    width: 205px;
    background: #ffffff;
    border-radius: 4px;
    box-shadow:
      0 2px 4px rgb(0 0 0 / 12%),
      0 0 6px rgb(0 0 0 / 4%);
    padding: 6px 0;
    position: relative;

    .choose-menu-item {
      width: 100%;
      height: 50px;
      letter-spacing: 2px;
      color: #8a8888;
      font-size: 24px;
      position: relative;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-left: 2px solid transparent;
      padding-left: 20px;

      &:hover {
        background-color: #deeaf7;
        border-left: 2px solid #004892;

        .icon {
          .svg-icon {
            color: #004892 !important;
          }
        }

        &::after {
          content: "";
          width: 0;
          height: 0;
          border: 5px solid #004892;
          border-left: 0;
          border-top-color: transparent;
          border-bottom-color: transparent;
          margin-left: 25px;
        }

        .choose-list-wrapper {
          display: block;
        }
      }

      .icon {
        // border: 1px solid red;
        // width: 20px;
        // height: 20px;
        margin-right: 7px;
        // margin-bottom: 4px;
        .svg-icon {
          color: #729dbb !important;
        }
      }
    }
  }

  & > .triangle {
    position: absolute;
    right: 40px;
    top: 15px;
    width: 10px;
    height: 10px;
    z-index: -1;
    border-radius: 1px;
    transform: rotate(45deg);

    &::before {
      content: " ";
      border-radius: 1px;
      position: absolute;
      width: 10px;
      height: 10px;
      top: 0;
      z-index: -1;
      background: #ffffff;
      box-shadow:
        0 2px 4px rgb(0 0 0 / 12%),
        0 0 6px rgb(0 0 0 / 4%);
      border-bottom-color: transparent !important;
      border-right-color: transparent !important;
    }
  }
}

.choose-list-wrapper {
  position: absolute;
  left: -265px;
  top: 0;
  padding-right: 15px;
  display: none;

  .menu-list {
    width: 250px;
    padding: 6px 0;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #c2c1bb;
    box-shadow:
      0 2px 4px rgb(0 0 0 / 12%),
      0 0 6px rgb(0 0 0 / 4%);
    position: relative;

    .menu-list-item {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-left: 2px solid transparent;

      &:hover {
        background-color: #deeaf7;
        border-left: 2px solid #004892;
      }
    }
  }

  & > .triangle {
    width: 12px;
    height: 12px;
    position: absolute;
    right: 10px;
    top: 21px;
    border-radius: 1px;
    border: 1px solid #c2c1bb;
    transform: rotate(45deg);
    border-left-color: transparent !important;
    border-bottom-color: transparent !important;

    &::before {
      content: " ";
      border-radius: 1px;
      position: absolute;
      width: 0;
      height: 0;
      left: 4px;
      top: -4px;
      border: 7px solid #fff;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      border-right: 0;
      transform: rotate(-45deg);
    }
  }
}
</style>
