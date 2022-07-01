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
import { db } from "~/electron-main/common/db";
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
  employee: null,
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

let defaultOriginRetailPayment = () => {
  return {
    payway: "无",
    payways: [],
    payAmt: 0,
    canRetAmt: 0,
  };
};

export enum RetailType {
  SALE,
  RET,
}

export const useRetailStore = defineStore("retail", {
  state: () => {
    const storeStore = userStoreStore();
    return {
      tableId: 12964,
      homeChart: [],
      homeGrid: {},
      type: RetailType.SALE,
      marketing: false,
      localBillCount: 1,
      retailFilter: {
        refno: "",
        phone: "",
        employeeId: "",
        billdate: null,
        status: "2",
      },
      retailList: [],
      retailItemList: [],
      selectRetailId: null,
      selectRetailItem: {},
      originRetailPayment: defaultOriginRetailPayment(),
      currentOfflineRetail: {},
      pos: {
        ...defaultMarketingRetail(),
        storeCode: storeStore.code,
      },
      payments: defaultPayment(),
    };
  },
  getters: {
    offlinePayment(state){
      return this.getPaymentSummary(state.currentOfflineRetail.payments);
    },
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
    filter(state) {
      let filter = {};
      for (let key in state.retailFilter) {
        let value = state.retailFilter[key];
        if (value) {
          if (key == "billdate") {
            filter[key] = {
              datebeg: value[0],
              dateend: value[1],
            };
          } else {
            filter[key] = value;
          }
        }
      }
      return filter;
    },
    originRetRetail(state) {
      const auth = useAuthStore();
      let items = [];
      for (let itemId in state.selectRetailItem) {
        items.push({
          itemId,
          qty: state.selectRetailItem[itemId].value,
        });
      }
      return {
        userId: auth.user.uid,
        originRetailId: state.selectRetailId,
        items,
        payments: state.payments,
      };
    },
    retTotalQty(state) {
      return this.originRetRetail.items.reduce((a, b) => a + b.qty, 0);
    },
    retTotalAmount(state) {
      let items = [];
      for (let itemId in state.selectRetailItem) {
        items.push(state.selectRetailItem[itemId]);
      }
      return items.reduce((a, b) => a + b.priceActual, 0);
    },
  },
  actions: {
    async queryDBRetail(
      filter = {
        isHang: null,
        isPay: null,
        isPush: null,
      }
    ) {
      let filters = [];
      let filterStr = ''
      if (filter.isHang == 0 || filter.isHang == 1) {
        filters.push(` is_hang = ${filter.isHang}`);
      }
      if (filter.isPay == 0 || filter.isPay == 1) {
        filters.push(` is_pay = ${filter.isPay}`);
      }
      if (filter.isPush == 0 || filter.isPush == 1) {
        filters.push(` is_push = ${filter.isPush}`);
      }
      if (filters.length > 0) {
        filterStr = ' where ' +filters.join(" and ");
      }
      let retails = db.prepare(
        `SELECT * FROM pos_retail ${filterStr}`
      ).all();
      console.log("🚀 ~ file: retail.ts ~ line 243 ~ retails", retails)
      return (retails || []).map((e) => {
        return JSON.parse(e.retail_json);
      });
    },
    async queryRetailList() {
      const api = useApi();
      const auth = useAuthStore();
      let res = await api.noPage("pos/retail_list", {
        ...this.filter,
        storeId: auth.user.storeId,
      });
      this.retailList = res;
    },
    async queryRetailItemList(row) {
      this.selectRetailId = row.id;
      const api = useApi();
      let items = await api.noPage("pos/retailitem_list", {
        retailId: row.id,
      });
      this.retailItemList = items;
      let payments = await api.noPage("pos/retailpayitem_list", {
        retailId: row.id,
      });
      console.log(
        "🚀 ~ file: retail.ts ~ line 216 ~ queryRetailItemList ~ payments",
        payments
      );
      if (!payments || payments?.length == 0) {
        this.originRetailPayment = defaultOriginRetailPayment();
      } else {
        let originRetailPayment = {
          payways: [],
        };
        for (let payment of payments) {
          originRetailPayment.payways.push(payment.payway);
          originRetailPayment.payAmt = payment.payAmt;
          originRetailPayment.canRetAmt = Math.round(
            payment.payAmt - payment.totRAmt,
            2
          );
        }
        originRetailPayment.payway = originRetailPayment.payways.join(" , ");
        this.originRetailPayment = originRetailPayment;
      }
    },
    getPaymentSummary(payments = []){
      let  originRetailPayment = defaultOriginRetailPayment();
      if (!payments || payments?.length == 0) {
        return originRetailPayment;
      } else {
        for (let payment of payments) {
          originRetailPayment.payways.push(payment.payway || payment.name);
          originRetailPayment.payAmt = payment.payAmt;
        }
        originRetailPayment.payway = originRetailPayment.payways.join(" , ");
        return originRetailPayment;
      }
    },
    async submitOriginRetRetail() {
      if (!this.selectRetailId) {
        ElMessage.warning("请选择零售单");
        return;
      }
      if (this.totPayAmt != this.retTotalAmount) {
        ElMessage.warning("实际退款和应退款不相等");
        return;
      }
      const api = useApi();
      let res = await api.custom("/api/submitOriginRetRetail", {
        ...this.originRetRetail,
      });
      console.log(
        "🚀 ~ file: retail.ts ~ line 202 ~ submitOriginRetRetail ~ res",
        res
      );
    },
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
        qty = Number(
          RetailType.SALE == this.type ? Math.abs(qty) : -Math.abs(qty)
        );
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
      if (this.type == RetailType.SALE) {
        await this.dealMarketing();
      }
      this.calcTotal();
    },
    async calcTotal() {
      for (const item of this.pos.items) {
        item.amount = item.qty * item.price;
        item.actAmount = item.qty * item.actPrice;
      }
      this.pos.totAmount = this.pos.items.reduce((a, b) => a + b.amount, 0);
      this.pos.totActAmount = this.pos.items.reduce(
        (a, b) => a + b.actAmount,
        0
      );
      this.pos.totQty = this.pos.items.reduce((a, b) => a + Number(b.qty), 0);
    },
    async changeRowItemField(index, key, value) {
      this.pos.items[index][key] = value;
      if (this.type == RetailType.SALE) {
        await this.dealMarketing();
      }
      this.calcTotal();
    },
    async delRetailItem(itemIndex) {
      this.pos.items.splice(itemIndex, 1);
      if (this.type == RetailType.SALE) {
        await this.dealMarketing();
      }
      this.calcTotal();
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
    async removePayment(index) {
      this.payments.splice(index, 1);
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
      if (!this.pos.salesrepId) {
        ElMessage.warning("请选择营业员");
        return;
      }
      console.log(
        `🚀 ~ file: retail.ts ~ line 288 ~ savePay ~ this.pos.integralDis'${
          this.pos.integralDis == ""
        }'`
      );
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
          ...this.pos.integralDis,
        })
        .then(() => {
          ElMessage.success("付款成功!");
          this.pos = {
            ...defaultMarketingRetail(),
            storeCode: store.code,
          };
          vip.vip = null;
          this.payments = defaultPayment();
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
