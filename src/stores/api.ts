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
    async custom(path, payload?) {
      let res = await request.post(path, payload);
      return res;
    },
    async queryAllItem(itemTableId, refId, pid) {
      let res = await request.post("/api/portal", {
        opt: "Q",
        tid: itemTableId,
        refId,
        pid,
        page: {
          num: 1,
          size: 10000,
        }
      });
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
    async saveItemDataRow(tid, head, rowId, value){
      let data = [
        {
          ...head,
          value
        }
      ]
      let newItemData = await request.post("/api/portal", {
        opt: "M",
        id: rowId,
        tid,
        data
      });
      return newItemData;
    },
    async delete(tid, idOrIds){
      let ids = []
      if(Object.prototype.toString.call(idOrIds) === "[object Array]"){
        ids = idOrIds
      }else{
        ids.push(idOrIds)
      }
      let res = await request.post("/api/portal", {
        tid,
        opt: "D",
        id: ids
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
          .put(`/noPage`, {
            table,
            ...filter,
          })
          .then((data) => {
            resolve(data?.data);
          });
      });
    },
    async detail(table: string, filter?: Object) {
      return new Promise((resolve, reject) => {
        request
          .put(`/detail`, {
            table,
            ...filter,
          })
          .then((data) => {
            resolve(data?.data);
          });
      });
    },
  },
});
