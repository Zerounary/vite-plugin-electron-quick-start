import { defineStore } from "pinia";
// import { electronStorage } from "~/electron-main/common/store";


export const useSettingStore  = defineStore("setting", {
  state: () => {
    return {
      url: ''
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["url"],
      },
    ],
  },
});