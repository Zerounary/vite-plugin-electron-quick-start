import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { ElMessage } from "element-plus";
import { useVipStore } from "./vip";
import moment from "moment";
import _ from "lodash";
import { useDateStore } from "./date";

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
      homeChart: [],
      homeGrid: {}
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
        let row = {
          id: item.id,
        };
        for (const field of state.retailItem.table.thead) {
          row[field.dbname] = item[field.id] || item[field.dbname];
        }
        result.push(row);
      }

      return result;
    }
  },
  actions: {
    async fetchHomeGrid() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      let res = await api.detail("pos/home_grid", {
        storeId: auth.user.storeId,
        billdate: date.getDateRange
      });
      this.homeGrid = res;
      return res;
    },
    async fetchRetailChart() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      const format = () => {
        if(date.tag == 'today'){
          return "HH24"
        }else if(date.tag == 'week' || date.tag == 'month'){
          return "DD"
        }else if(date.tag == 'year'){
          return "MM"
        }else {
          return "DD"
        }
      }
      let res = await api.noPage("pos/chart_retail", {
        format: format(),
        storeId: auth.user.storeId,
        billdate: date.getDateRange,
      });
      this.homeChart = res;
      return res;
    },
    async fetchRetail() {},
    async fetchRetailItem() {
      const api = useApi();
      let item = this.getItem('M_RETAILITEM');
      let res = await api.queryAllItem(item.tid, item.refId, item.pid);
      console.log("🚀 ~ file: retail.ts ~ line 62 ~ fetchRetailItem ~ res", res)
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
    async changeRowItemField(index, key, value){
      this.retailItem.table.tbody[index][key] = value;
    },
    async saveRowItem(index, key) {
      const api = useApi();
      let row = this.retailItem.table.tbody[index]
      let item = this.getItem('M_RETAILITEM');
      let head = this.retailItem.table.thead.find(item => item.dbname === key);
      let value = row[key];
      let newDateItem =  await api.saveItemDataRow(item.tid, head, row.id, value);
      await this.fetchRetailItem();
      return newDateItem;
    },
    async delRetailItem(id){
      const api = useApi();
      let item = this.getItem('M_RETAILITEM');
      await api.delete(item.tid, id);
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
