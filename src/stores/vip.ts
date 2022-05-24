import { defineStore } from "pinia";
import { request } from "@/util/request";

export const useVipStore = defineStore("vip", {
  state: () => {
    return {
      vip: null,
    };
  },
  actions: {
    async fetchVip(keyword) {
      this.vip = (
        await request.put("/smd/vip", {
          keyword,
        })
      )?.data;
    },
  },
});
