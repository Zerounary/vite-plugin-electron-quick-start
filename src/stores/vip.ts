import { defineStore } from "pinia";
import { request } from "@/util/request";
import { useApi } from "./api";
import { useAuthStore } from "./auth";

export const useVipStore = defineStore("vip", {
  state: () => {
    return {
      tableId: 12899,
      vip: null,
      vipTypes: [],
      vipForm: {
        // 必填字段
        cardno: "",
        CViptypeId: "",
        vipname: "",
        birthday: "",

        mobil: "",
        HrEmployeeId: "",
        description: "",
        sex: "m",
      },
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
    async fetchAllVipType(filter?) {
      const api = useApi();
      this.vipTypes = await api.noPage("viptype", filter);
    },
    async save(newVip) {
      const api = useApi();
      const auth = useAuthStore();
      this.vip = await api.add(this.tableId, {
        CCustomerId: auth.user.customerId,
        CStoreId: auth.user.storeId,
        ...newVip,
      });
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["vip"],
      },
    ],
  },
});
