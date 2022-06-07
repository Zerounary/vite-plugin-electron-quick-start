import { useDateStore } from './date';
import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";


export const useProductStore = defineStore("product", {
  state: () => {
    return {
      rank: []
    };
  },
  actions: {
    async fetchProductRank() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      let res = await api.noPage("pos/product_rank", {
        storeId: auth.user.storeId,
        billdate: date.getDateRange
      });
      this.rank = res;
      return res;
    },
    async fetchProductKeyWord(keyword) {
      const api = useApi();
      let result = await api.detail("productKeyWord", { keyword });
      console.log("🚀 ~ file: product.ts ~ line 14 ~ fetchProductKeyWord ~ result", result)
      return result;
    },
    async fetchMatrix(productId) {
      const api = useApi();
      const auth = useAuthStore();
      let res = await api.custom("/api/matrix-query", { productId, storeId: auth.user.storeId });
      return res;
    }
  }
})