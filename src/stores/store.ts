import { useApi } from "./api";
import { useAuthStore } from "./auth";
import { defineStore } from "pinia";

export const userStoreStore = defineStore("store", {
  state: () => {
    return {
      id: null,
      code: '',
      name: "无",
      storageQty: 0,
      vipNum: 0,
    };
  },
  actions: {
    async fetchUserStore() {
      const auth = useAuthStore();
      const api = useApi();
      let res = await api.detail("pos/pos_header", {
        storeId: auth.user.storeId,
      });
      this.$patch(res);
    },
  },
});
