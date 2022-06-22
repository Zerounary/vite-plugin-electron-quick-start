import { request } from '@/utils/request';
import { defineStore } from "pinia";

export const useApi = defineStore("api", {
  actions: {
    async test() {
      const res = await request.get('http://www.baidu.com')
      console.log("🚀 ~ file: api.ts ~ line 8 ~ test ~ res", res)
    }
  }
});