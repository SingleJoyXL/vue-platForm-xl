import { store } from "@/store";
import { defineStore } from "pinia";
import { storageLocal } from "@pureadmin/utils";
import { getConfig, responsiveStorageNameSpace } from "@/config";

export const useEpThemeStore = defineStore({
  id: "pure-epTheme",
  state: () => ({
    epThemeColor:
      storageLocal().getItem<StorageConfigs>(
        `${responsiveStorageNameSpace()}layout`
      )?.epThemeColor ?? getConfig().EpThemeColor,
    epTheme:
      storageLocal().getItem<StorageConfigs>(
        `${responsiveStorageNameSpace()}layout`
      )?.theme ?? getConfig().Theme
  }),
  getters: {
    getEpThemeColor(state) {
      return state.epThemeColor;
    },
    /** 用于mix导航模式下hamburger-svg的fill属性 */
    fill(state) {
      if (state.epTheme === "light") {
        return "#409eff";
      } else if (state.epTheme === "yellow") {
        return "#d25f00";
      } else {
        return "#fff";
      }
    }
  }
});

export function useEpThemeStoreHook() {
  return useEpThemeStore();
}
