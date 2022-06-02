import { defineStore } from "pinia";
import { request } from "@/util/request";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { ElMessage } from "element-plus";
import { useVipStore } from "./vip";
import moment from "moment";
import _ from "lodash";

let defaultRetailForm = () => ({
  // 必填字段
  billdate: moment().format("YYYYMMDD"),
  SalesrepId: null,
});

export const useRetailStore = defineStore("retail", {
  state: () => {
    return {
      tableId: 12964,
      retail: null,
      retailForm: defaultRetailForm(),
    };
  },
  getters: {
    retailObject: (state) => {
      let result = {};
      if (state.retail?.data) {
        for (const field of state.retail.data) {
          result[field.dbname] = field.value;
        }
        return result;
      }else {
        return {}
      }
    }
  },
  actions: {
    async fetchRetail() {},
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
        console.log(
          "🚀 ~ file: retail.ts ~ line 36 ~ returnnewPromise ~ result",
          result
        );
        this.retail = result;
        // await this.fetchRetail();
        resolve(this.retail);
      });
    },
    async putRetailItem(skus) {
      const api = useApi();
      console.log("🚀 ~ file: retail.ts ~ line 52 ~ putRetailItem ~ this.retail", this.retail)
      let item = _.find(this.retail.items, {
        name: "M_RETAILITEM",
      });
      console.log(
        "🚀 ~ file: retail.ts ~ line 53 ~ putRetailItem ~ item",
        item
      );
      let refId = item.id;
      let itemTableId = item.tid;
      await api.addProductItem(itemTableId, this.retail.id, refId, skus);
      // await this.fetchRetail();
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
        paths: ["retail", "retailForm"],
      },
    ],
  },
});
