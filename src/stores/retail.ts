import { useProductStore } from "./product";
import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { ElMessage } from "element-plus";
import { useVipStore } from "./vip";
import moment from "moment";
import _ from "lodash";
import { useDateStore } from "./date";
import { insert } from "~/electron-main/common/db";
import { userStoreStore } from "./store";

let defaultRetailForm = () => ({
  // 必填字段
  billdate: moment().format("YYYYMMDD"),
  SalesrepId: null,
});

let itemType = {
  good: {
    spuCode: "",
    spuName: "",
    skuCode: "",
    dims: [
      {
        code: "",
        value: "",
      },
    ],
  },
  qty: 0,
  amount: 0,
  actAmount: 0,
  price: 0,
  actPrice: 0,
  discount: 0,
  activityDisAmount: 0,
  ticketDisAmount: 0,
  vipIntegralDisAmount: 0,
};
let activityItemType = {
  activityNo: "",
  activityName: "",
  activityType: "",
  activityDisAmount: 0,
  goodItems: [
    {
      subDocno: "",
      activityDisAmount: 0,
    },
  ],
  giftItem: {
    giftSkuCode: "",
    giftQty: 0,
    giftActPrice: 0,
    giftActAmount: 0,
  },
};

let ticketItemType = {
  ticketNo: "",
  ticketName: "",
  ticketType: "",
  ticketDisAmount: 0,
  invalidate: "",
  sort: 0,
  goodItems: [
    {
      subDocno: "",
      activityDisAmount: 0,
    },
  ],
};

let defaultMarketingRetail = () => ({
  source: "POS",
  docno: crypto.randomUUID(),
  billdate: moment().format("YYYYMMDD"),
  storeCode: "",
  totQty: 0,
  totAmount: 0,
  totActAmount: 0, // 实际金额
  totDisAmount: 0, // 折扣金额
  freight: 0,
  vip: {},
  integralDis: {},
  items: [],
  activityItems: [],
  ticketItems: [],
});

export const useRetailStore = defineStore("retail", {
  state: () => {
    return {
      tableId: 12964,
      retail: null,
      retailItem: null,
      retailForm: defaultRetailForm(),
      homeChart: [],
      homeGrid: {},
      pos: defaultMarketingRetail(),
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
      } else {
        return {};
      }
    },
    itemData: (state) => {
      if (!state.retailItem?.table) return [];

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
    },
  },
  actions: {
    async fetchHomeGrid() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      let res = await api.detail("pos/home_grid", {
        storeId: auth.user.storeId,
        billdate: date.getDateRange,
      });
      this.homeGrid = res;
      return res;
    },
    async fetchRetailChart() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      const format = () => {
        if (date.tag == "today") {
          return "HH24";
        } else if (date.tag == "week" || date.tag == "month") {
          return "DD";
        } else if (date.tag == "year") {
          return "MM";
        } else {
          return "DD";
        }
      };
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
      let item = this.getItem("M_RETAILITEM");
      let res = await api.queryAllItem(item.tid, item.refId, item.pid);
      console.log(
        "🚀 ~ file: retail.ts ~ line 62 ~ fetchRetailItem ~ res",
        res
      );
      this.retailItem = res;
      return res;
    },
    getItem(name) {
      let item = _.find(this.retail.items, {
        name,
      });
      return {
        tid: item.tid,
        refId: item.id,
        pid: this.retail.id,
      };
    },
    async createRetail() {
      const store = userStoreStore();
      const vip = useVipStore();
      if (store.code) {
        ElMessage.warning("未查询到店仓编码");
        return;
      }
      insert("pos_retail", [
        {
          docno: this.pos.docno,
          retail_json: JSON.stringify({
            ...this.pos,
            vip: vip.vip,
            storeCode: store.code,
          }),
        },
      ]);
    },

    async putRetailItem(skus: Object) {
      // 将需要插入的skus查询出调用营销执行和展示的所有字段
      const product = useProductStore();
      for (const skuCode in skus) {
        let sku = await product.fetchSkuFull(skuCode);
        let { price, good } = sku;
        let qty = skus[skuCode];
        this.pos.items.push({
          good,
          qty,
          color: sku.color,
          size: sku.size,
          amount: price * qty,
          actAmount: price * qty,
          price,
          actPrice: price,
          discount: 1,
          activityDisAmount: 0,
          ticketDisAmount: 0,
          vipIntegralDisAmount: 0,
        });
      }
    },
    async changeRowItemField(index, key, value) {
      this.retailItem.table.tbody[index][key] = value;
    },
    async saveRowItem(index, key) {
      const api = useApi();
      let row = this.retailItem.table.tbody[index];
      let item = this.getItem("M_RETAILITEM");
      let head = this.retailItem.table.thead.find(
        (item) => item.dbname === key
      );
      let value = row[key];
      let newDateItem = await api.saveItemDataRow(
        item.tid,
        head,
        row.id,
        value
      );
      await this.fetchRetailItem();
      return newDateItem;
    },
    async delRetailItem(itemIndex) {
      this.pos.items.splice(itemIndex, 1);
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
        paths: ["retail", "retailForm", "retailItem", "pos"],
      },
    ],
  },
});
