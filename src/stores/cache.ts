import { defineStore } from "pinia";
import { getLastModifidDate } from "~/electron-main/common/db";
import { useApi } from "./api";
import { insert } from "~/electron-main/common/db";
export const useCacheStore = defineStore("cache", {
  state: () => {
    return {
      isLoading: false,
      loadingMessage: "正在请求数据...",
    };
  },
  actions: {
    async cacheAll() {
      this.isLoading = true;
      await this.cacheVipType();
      await this.cacheVipTypeDis();
      await this.cacheAttribute();
      await this.cacheAttributeValue();
      await this.cacheAttributesetinstance();
      await this.cacheDimDef();
      await this.cacheDim();
      await this.cacheProduct();
      await this.cacheProductAlias();
      this.isLoading = false;
    },
    async cacheVipType() {
      const api = useApi();
      let table = "c_viptype";
      this.loadingMessage = "正在请求会员类型...";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存会员类型数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存会员类型数据完成...`;
    },
    async cacheVipTypeDis() {
      const api = useApi();
      let table = "c_viptype_dis";
      this.loadingMessage = "正在请求会员类型折扣...";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存会员类型折扣数据(${
        res?.length || 0
      }条)...`;
      insert(table, res);
      this.loadingMessage = `缓存会员类型折扣数据完成...`;
    },
    async cacheAttribute() {
      const api = useApi();
      let table = "m_attribute";
      this.loadingMessage = "正在请求尺寸组...";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存尺寸组数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存会员类型折扣数据完成...`;
    },
    async cacheAttributesetinstance() {
      const api = useApi();
      let table = "m_attributesetinstance";
      this.loadingMessage = "正在请求ASI..";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存ASI数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存ASI数据完成...`;
    },
    async cacheAttributeValue() {
      const api = useApi();
      let table = "m_attributevalue";
      this.loadingMessage = "正在请求颜色尺码..";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存颜色尺码数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存颜色尺码数据完成...`;
    },
    async cacheDim() {
      const api = useApi();
      let table = "m_dim";
      this.loadingMessage = "正在请求商品属性值..";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存商品属性值数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存商品属性值数据完成...`;
    },
    async cacheDimDef() {
      const api = useApi();
      let table = "m_dimdef";
      this.loadingMessage = "正在请求商品属性..";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存商品属性数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存商品属性数据完成...`;
    },
    async cacheProduct() {
      const api = useApi();
      let table = "m_product";
      this.loadingMessage = "正在请求商品..";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存商品数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存商品数据完成...`;
    },
    async cacheProductAlias() {
      const api = useApi();
      let table = "m_product_alias";
      this.loadingMessage = "正在请求条码..";
      let res = await api.noPage(`cache/${table}`, {
        lastModifyDate: getLastModifidDate(table),
      });
      this.loadingMessage = `开始缓存条码数据(${res?.length || 0}条)...`;
      insert(table, res);
      this.loadingMessage = `缓存条码数据完成...`;
    },
  },
});
