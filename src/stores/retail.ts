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
      retailItem: null,
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
    },
    itemData: (state) => {
      if(!state.retailItem?.table)
        return []

      let result = [];

      for (const item of state.retailItem.table.tbody) {
        let row = {};
        for (const field of state.retailItem.table.thead) {
          row[field.dbname] = item[field.id] || item[field.dbname];
        }
        result.push(row);
      }

      return result;
    }
  },
  actions: {
    async fetchRetail() {},
    async fetchRetailItem() {
      const api = useApi();
      let item = this.getItem('M_RETAILITEM');
      let res = await api.queryAllItem(item.tid, item.refId, item.pid);
      this.retailItem = res;
      return res;
    },
    getItem(name) {
      let item = _.find(this.retail.items, {
        name
      });
      return {
        tid: item.tid,
        refId: item.id,
        pid: this.retail.id,
      };
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
        this.retail = result;
        // await this.fetchRetail();
        resolve(this.retail);
      });
    },
    async putRetailItem(skus) {
      const api = useApi();
      let item = this.getItem('M_RETAILITEM');
      await api.addProductItem(item.tid, item.pid, item.refId, skus);
      // await this.fetchRetail();
      await this.fetchRetailItem();
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
        paths: ["retail", "retailForm", "retailItem"],
      },
    ],
  },
});
