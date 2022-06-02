import { request } from "@/util/request";
import { defineStore } from "pinia";
import _ from "lodash";

export const defaultTransformFn = (data) => {
  if (Object.prototype.toString.call(data) === "[object Array]") {
    return data.data;
  } else if (Object.prototype.toString.call(data) === "[object Object]") {
    let result = [];
    for (let key in data) {
      let dbname = _.snakeCase(key).toUpperCase();
      let value = data[key];
      // 一般类型
      result.push({
        dbname,
        value,
      });
    }
    return result;
  }
};

export const useApi = defineStore("portal", {
  state: () => {
    return {};
  },

  actions: {
    async custom(path, payload) {
      let res = await request.post(path, payload);
      return res;
    },
    async add(tid, data, transformFn?) {
      transformFn = transformFn || defaultTransformFn;
      let res = await request.post("/api/portal", {
        opt: "A",
        tid,
        params: transformFn(data),
      });
      return res
    },
    async addProductItem(tid, pid, refId, skus){
      let res = await request.post("/api/portal", {
        tid,
        pid,
        refId,
        opt: "A",
        skus,
        params: []
      });
      return res
    },
    async detail(table, filter) {
      return new Promise((resolve, reject) => {
        request.put(`/smd/${table}`, filter).then((data) => {
          resolve(data?.data);
        });
      });
    },
    async Page(table, filter) {
      return new Promise((resolve, reject) => {
        request.put(`/sml/${table}`, filter).then((data) => {
          resolve(data);
        });
      });
    },
    async noPage(table, filter) {
      return new Promise((resolve, reject) => {
        request
          .put(`/sml/${table}`, {
            noPage: true,
            ...filter,
          })
          .then((data) => {
            resolve(data?.data);
          });
      });
    },
  },
});
