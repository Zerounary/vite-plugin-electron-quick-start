import { defineStore } from "pinia";
import { useApi } from "./api";


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
    }
  }
})