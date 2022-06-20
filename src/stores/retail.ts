import ipcNames from "~/electron-main/common/ipcNames";
import { useProductStore } from "./product";
import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { ElMessage } from "element-plus";
import { useVipStore } from "./vip";
import moment from "moment";
import _, { result } from "lodash";
import { useDateStore } from "./date";
import { insert } from "~/electron-main/common/db";
import { userStoreStore } from "./store";
import {
  rendererInvoke,
  rendererSend,
  rendererSendSync,
} from "~/electron-main/common/ipcRender";

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
  billdate: moment().format("YYYY-MM-DD"),
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

let defaultPayment = () => {
  return [
    {
      paywayId: 2,
      name: "现金",
      payAmt: 0,
    },
  ];
};
export const useRetailStore = defineStore("retail", {
  state: () => {
    const storeStore = userStoreStore();
    return {
      tableId: 12964,
      homeChart: [],
      homeGrid: {},
      marketing: false,
      localBillCount: 1,
      pos: {
        ...defaultMarketingRetail(),
        storeCode: storeStore.code,
      },
      payments: defaultPayment(),
    };
  },
  getters: {
    totPayAmt(state) {
      return state.payments.reduce((sum, item) => {
        return sum + Number(item.payAmt);
      }, 0);
    },
    changeAmt(state) {
      let change = Number(this.totPayAmt) - Number(state.pos.totActAmount);
      return change < 0 ? 0 : change;
    },
    getItemActivity(state) {
      return (index) => {
        let result = [];
        for (const activity of state.pos.activityItems) {
          for (const goodItem of activity.goodItems) {
            if (goodItem.subDocno == index) {
              result.push({
                activityName: activity.activityName,
                activityType: activity.activityType,
                activityDisAmount: goodItem.activityDisAmount,
              });
            }
          }
        }
        return result;
      };
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
    async createRetail() {
      const store = userStoreStore();
      const vip = useVipStore();
      if (!store.code) {
        ElMessage.warning("未查询到店仓编码");
        return;
      }
      this.pos = {
        ...defaultMarketingRetail(),
        storeCode: store.code,
        vipCardno: vip.vip?.cardno,
      };
      this.localBillCount++;
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
      this.marketing = true;
      let res = await api.custom("/api/deal-marketing", this.pos);
      // 直接替换接口报错就会有问题
      if (res.docno) {
        this.pos = res;
      }
      this.marketing = false;
    },
    async saveToDB(params) {
      const store = userStoreStore();
      const vip = useVipStore();
      insert("pos_retail", [
        {
          ...params,
          id: this.pos.docno,
          retail_json: JSON.stringify({
            ...this.pos,
            vip: vip.vip,
            storeCode: store.code,
            changeAmt: this.changeAmt,
            payments: this.payments,
          }),
        },
      ]);
    },
    async hangRetail() {
      await this.saveToDB({
        is_hang: 1,
      });
      ElMessage.success("挂单成功!");
      await this.createRetail();
    },
    async appendPayment(payment) {
      let existIndex = this.payments.findIndex(
        (item) => item.paywayId == payment.paywayId
      );
      if (existIndex >= 0) {
        this.payments.splice(existIndex, 1, {
          paywayId: payment.paywayId,
          name: payment.name,
          payAmt: Number(payment.payAmt) + this.payments[existIndex].payAmt,
        });
      } else {
        this.payments.push(payment);
      }
    },
    async rePay() {
      this.payments = defaultPayment();
    },
    async savePay() {
      const api = useApi();
      const store = userStoreStore();
      const vip = useVipStore();
      const auth = useAuthStore();
      if (this.pos.totActAmount != this.totPayAmt - this.changeAmt) {
        ElMessage.warning("实际收款和应收不相等，请检查!");
        return;
      }
      if(!this.pos.salesrepId){
        ElMessage.warning("请选择营业员");
        return;
      }
      console.log(`🚀 ~ file: retail.ts ~ line 288 ~ savePay ~ this.pos.integralDis'${this.pos.integralDis == ''}'`)
      // 检查网络并提交到接口
      api
        .custom("/api/savePosRetail", {
          ...this.pos,
          vip: vip.vip,
          vipCardno: vip.vip?.cardno,
          storeCode: store.code,
          changeAmt: this.changeAmt,
          payments: this.payments,
          userId: auth.user.uid,
          ...this.pos.integralDis
        })
        .catch(() => {
          this.saveToDB({
            is_pay: 1,
          });
          ElMessage.warning("网络不可用，本单已离线缓存!");
        });
    },
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
