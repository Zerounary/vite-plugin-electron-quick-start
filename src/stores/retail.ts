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
  source: "store",
  docno: crypto.randomUUID(),
  // billdate: moment().format("YYYY-MM-DD"),
  storeCode: "",
  salesrepId: null,
  totQty: 0,
  totAmount: 0,
  totActAmount: 0, // 实际金额
  totDisAmount: 0, // 折扣金额
  totVipDisAmount: 0, //会员优惠
  freight: 0,
  vip: null,
  integralDis: {},
  items: [],
  activityItems: [],
  ticketItems: [],
});

export const useRetailStore = defineStore("retail", {
  state: () => {
    const storeStore = userStoreStore();
    return {
      tableId: 12964,
      homeChart: [],
      homeGrid: {},
      pos: {
        ...defaultMarketingRetail(),
        storeCode: storeStore.code
      },
    };
  },
  getters: {},
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
      await this.dealMarketing();
    },
    async changeRowItemField(index, key, value) {
      this.pos.items[index][key] = value;
      await this.dealMarketing();
    },
    async delRetailItem(itemIndex) {
      this.pos.items.splice(itemIndex, 1);
      await this.dealMarketing();
    },
    async dealMarketing() {
      const api = useApi();
      let res = await api.custom("/api/deal-marketing", this.pos)
      console.log("🚀 ~ file: retail.ts ~ line 183 ~ dealMarketing ~ res", res)
      // 直接替换接口报错就会有问题
      if(res.docno){
        this.pos = res;
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ["retail", "pos"],
      },
    ],
  },
});
