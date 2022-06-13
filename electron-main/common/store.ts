import fs from "fs";
import log from "electron-log";
import Store from "electron-store";

const stores = {};

/**
 * 生成或获取 Store 对象
 * @param {*} name store 名
 * @param {*} isIgnoredError 是否忽略错误
 * @param {*} isShowErrorAlert 是否显示错误弹窗
 * @returns Store
 */
export let getStore = (
  name,
  isIgnoredError = true,
  schema = {}
) => {
  if (stores[name]) return stores[name];
  let store;
  try {
    store = stores[name] = new Store({
      name,
      clearInvalidConfig: false,
      schema,
    });
  } catch (error) {
    log.error(error);

    if (!isIgnoredError) throw error;

    const backPath = name + ".json.bak";
    fs.copyFileSync(name + ".json", backPath);

    store = new Store({ name, clearInvalidConfig: true, schema });
  }
  return store;
};

getStore("app");

export const electronStorage: Storage = {
  setItem(key = "", value) {
    getStore("app").set(key, value);
  },
  getItem(key): string {
    return getStore("app").get(key);
  },
  length: 0,
  clear: function (): void {
    getStore("app").clear();
  },
  key: function (index: number): string {
    return getStore("app");
  },
  removeItem: function (key: string): void {
    getStore("app").delete(key);
  },
};
