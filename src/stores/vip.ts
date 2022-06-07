import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { useDateStore } from "./date";
import { ElMessage } from "element-plus";

let defaultVipForm = () => ({
  // 必填字段
  cardno: "",
  CViptypeId: "",
  vipname: "",
  birthday: "",

  mobil: "",
  HrEmployeeId: "",
  description: "",
  sex: "m",
});

export const useVipStore = defineStore("vip", {
  state: () => {
    return {
      tableId: 12899,
      vip: null,
      vipTypes: [],
      vipForm: defaultVipForm(),
      rank: []
    };
  },
  getters: {},
  actions: {
    async fetchVipRank() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      let res = await api.noPage("pos/vip_rank", {
        storeId: auth.user.storeId,
        billdate: date.getDateRange,
      });
      this.rank = res;
      return res;
    },
    async fetchVip(keyword) {
      const api = useApi();
      this.vip = await api.custom(`/api/marketing-vip-query?keyword=${keyword}`);
    },
    async fetchAllVipType(filter?) {
      const api = useApi();
      this.vipTypes = await api.noPage("viptype", filter);
    },
    async save(newVip) {
      return new Promise(async (resolve, reject) => {
        let dbVip = await this.isExists(newVip.cardno);
        if (dbVip) {
          ElMessage.warning(`所注册的会员【${newVip.cardno}】，已存在`);
          this.vip = dbVip;
          resolve(this.vip);
          return;
        }
        const api = useApi();
        const auth = useAuthStore();
        let result = await api.add(this.tableId, {
          CCustomerId: auth.user.customerId,
          CStoreId: auth.user.storeId,
          ...newVip,
        });
        console.log(
          "🚀 ~ file: vip.ts ~ line 55 ~ returnnewPromise ~ result",
          result
        );
        if (result?.code == 2) {
          reject();
        }
        ElMessage.success(`会员【${newVip.vipname}】新增成功`);
        await this.fetchVip(newVip.mobil);
        resolve(this.vip);
      });
    },
    async isExists(mobil) {
      const api = useApi();
      let res = await api.detail("vip", { keyword: mobil });
      return res;
    },
    resetVipForm() {
      this.vipForm = defaultVipForm();
    },
  },
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       storage: localStorage,
  //       paths: ["vip"],
  //     },
  //   ],
  // },
});
