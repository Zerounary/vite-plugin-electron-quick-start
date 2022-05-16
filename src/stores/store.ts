import { defineStore } from "pinia";

export const userStoreStore = defineStore("store", {
  state: () => {
    return {
      id: null,
      name: "无",
      storageQty: 0,
      vipNum: 0,
    };
  },
});
