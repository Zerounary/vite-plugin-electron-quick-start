import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";


export const useProductStore = defineStore("product", {
  state: () => {
    return {
    };
  },
  actions: {
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