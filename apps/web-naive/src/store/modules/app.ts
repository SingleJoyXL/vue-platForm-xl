import { store } from "@/store";
import { appType } from "./types";
import { defineStore } from "pinia";
import { getConfig, responsiveStorageNameSpace } from "@/config";
import { deviceDetection, storageLocal } from "@pureadmin/utils";

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): appType => ({
    sidebar: {
      withoutAnimation: false,
      isClickCollapse: false
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    device: deviceDetection() ? "mobile" : "desktop"
  }),
  getters: {
    getSidebarStatus(state) {
      return state.sidebar.opened;
    },
    getDevice(state) {
      return state.device;
    }
  },
  actions: {
    async toggleSideBar(opened?: boolean, resize?: string) {
      await this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout) {
      this.layout = layout;
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
