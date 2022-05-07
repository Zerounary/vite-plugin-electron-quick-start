import path from 'path'
import fs from 'fs'
import { dialog, app, shell } from 'electron'
import log from 'electron-log'
import Store from 'electron-store'

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
  isShowErrorAlert = true,
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

    const backPath = path.join(app.getPath("userData"), name + ".json.bak");
    fs.copyFileSync(
      path.join(app.getPath("userData"), name + ".json"),
      backPath
    );
    if (isShowErrorAlert) {
      dialog.showMessageBoxSync({
        type: "error",
        message: name + " data load error",
        detail: `We have helped you back up the old ${name} file to: ${backPath}\nYou can try to repair and restore it manually\n\nError detail: ${error.message}`,
      });
      shell.showItemInFolder(backPath);
    }

    store = new Store({ name, clearInvalidConfig: true, schema });
  }
  return store;
};