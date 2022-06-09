import { useDateStore } from "./date";
import { defineStore } from "pinia";
import { useApi } from "./api";
import { useAuthStore } from "./auth";
import {
  db,
  queryMarketDim,
  queryProductAttributesSql,
  queryProductByIdSql,
  queryProductDimsSql,
  queryProductKeyWordLikeSql,
  queryProductKeyWordSql,
  queryProductSkuSql,
  querySkuFull,
} from "~/electron-main/common/db";

export const useProductStore = defineStore("product", {
  state: () => {
    return {
      rank: [],
    };
  },
  getters: {
    getSkuFull: (state) => {
      return (skuCode) => {
        let sku = db.prepare(queryMarketDim).get(skuCode);
        return sku;
      }
    }
  },
  actions: {
    async fetchProductRank() {
      const auth = useAuthStore();
      const date = useDateStore();
      const api = useApi();
      let res = await api.noPage("pos/product_rank", {
        storeId: auth.user.storeId,
        billdate: date.getDateRange,
      });
      this.rank = res;
      return res;
    },
    async fetchProductKeyWord(keyword) {
      // keyword：条码，条码关键字，款号，款号关键字
      // 如果
      let results = db.prepare(queryProductKeyWordSql).all(keyword);
      console.log(
        "🚀 ~ file: product.ts ~ line 36 ~ fetchProductKeyWord ~ results",
        results
      );
      return results;
    },
    async fetchProductKeyWordLikeList(keyword){
      let results = db.prepare(queryProductKeyWordLikeSql).all(keyword);
      return results;
    },
    async fetchMatrix(productId) {
      let product = db.prepare(queryProductByIdSql).all(productId);
      let attributes = db.prepare(queryProductAttributesSql).all({
        id: productId,
      });
      let skus = db.prepare(queryProductSkuSql).all(productId);
      return {
        product,
        attributes,
        skus,
      };
    },
    async fetchSkuFull(skuCode: string){
      let sku = db.prepare(querySkuFull).get(skuCode);
      let dims = db.prepare(queryProductDimsSql).all(skuCode);
      console.log("🚀 ~ file: product.ts ~ line 63 ~ fetchSkuFull ~ dims", dims)
      return {
        subDocno: sku.id,
        good: {
          spuCode: sku.spuCode,
          spuName: sku.spuName,
          skuCode: sku.skuCode,
          dims
        },
        color: sku.color,
        size: sku.size,
        price: sku.price,
      };
    }
  },
});
