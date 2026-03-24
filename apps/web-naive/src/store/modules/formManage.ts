import { defineStore } from "pinia";
import { store } from "@/store";

export const useFormStore = defineStore("form-manage", {
  state: () => ({
    // 应用数据
    dataList: [],
    // 分组数据
    fieldGroupPList: []
  }),
  actions: {
    // 设置分组数据
    INT_FieldGroupPList() {
      this.fieldGroupPList = [];
    },
    // 设置分组数据
    SET_FieldGroupPList(data: any) {
      this.fieldGroupPList = data;
    },
    // 更新分组数据
    UPDATE_FieldGroupPList(data: any) {
      this.fieldGroupPList = data;
    }
  },
  getters: {
    // 这里取名不可与state里的变量一致 所以取名getApplicationData
    getData: state => state.dataList,
    // 获取分组数据
    getFieldGroupPList: state => state.fieldGroupPList
  }
});

export function useFormStoreHook() {
  return useFormStore(store);
}
