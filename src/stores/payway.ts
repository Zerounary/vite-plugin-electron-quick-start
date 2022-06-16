import { defineStore } from "pinia";
import { db } from "~/electron-main/common/db";

export const usePaywayStore = defineStore("payway", {
  state: () => {
    return {
      payways: []
    };
  },
  actions: {
    async fetchAllPayway(filter?) {
      let payways = db.prepare(`SELECT * FROM c_payway`).all();
      this.payways = payways;
    },
  },
});
