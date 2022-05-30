import { defineStore } from "pinia";
import { request } from "@/util/request";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { ElMessage } from "element-plus";
import { useVipStore } from "./vip";
import moment from "moment";
import { useThrottledRefHistory } from "@vueuse/core";

let defaultRetailForm = () => ({
  // 必填字段
  billdate: moment().format("YYYYMMDD"),
  SalesrepId: null
});

export const useRetailStore = defineStore("retail", {
  state: () => {
    return {
      tableId: 12964,
      retail: null,
      retailForm: defaultRetailForm(),
    };
  },
  getters: {},
  actions: {
    async fetchRetail() {

    },
    async createRetail(newRetail) {
      return new Promise(async (resolve, reject) => {
        const api = useApi();
        const auth = useAuthStore();
        const vip = useVipStore();
        let result = await api.add(this.tableId, {
          CCustomerId: auth.user.customerId,
          CStoreId: auth.user.storeId,
          CVipId: vip.vip?.id || null,
          SalesrepId: this.retailForm.SalesrepId || null,
          billdate: moment().format("YYYYMMDD"),
          ...newRetail,
        });
        console.log("🚀 ~ file: retail.ts ~ line 36 ~ returnnewPromise ~ result", result)
        await this.fetchRetail();
        resolve(this.retail);
      });
    },
    resetRetailForm() {
      this.retailForm = defaultRetailForm();
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: [],
      },
    ],
  },
});
