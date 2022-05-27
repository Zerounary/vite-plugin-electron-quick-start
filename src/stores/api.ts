import { request } from "@/util/request";
import { defineStore } from "pinia";
import _ from "lodash";


export const defaultTransformFn = (data) => {
  if(Object.prototype.toString.call(data) === '[object Array]'){
    return data.data
  }else if (Object.prototype.toString.call(data) === '[object Object]') {
    let result = [];
    for(let key in data){
      let dbname = _.snakeCase(key).toUpperCase();
      let value = data[key];
      // 一般类型
      result.push({
        dbname,
        value
      })
    }
    return result;
  }
}

export const useApi = defineStore("portal", {
  state: () => {
    return {}
  },

  actions: {
    async add(tid, data, transformFn?) {
      transformFn = transformFn || defaultTransformFn;
      let res = await request.post("/api/protal", {
        opt: "A",
        tid,
        data: transformFn(data),
      });
      console.log("🚀 ~ file: portal.ts ~ line 24 ~ add ~ res", res)
    }
  }
})