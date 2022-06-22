import log from "electron-log";
import { app, Menu } from "electron";
import { mainSend, mainOn } from "../common/ipcMain";
import ipcNames from "../common/ipcNames";
import autoLaunch from "./autoLaunch";
import { getStore } from "../common/store";

export default (win) => {
  let electronStore_app = getStore("app");
  let isFirstStart = electronStore_app.get("isFirstStart");
  let isFirst = isFirstStart === undefined;
  electronStore_app.set("isFirstStart", isFirst); // 第一次启动时还未生成配置文件

  mainSend(win, ipcNames.Test, new Date().toLocaleString());
  /**
   * 退出
   */
  mainOn(ipcNames.quit, (event, message) => {
    app.quit();
  });

  /**
   * 最大化
   */
  mainOn(ipcNames.maximize, () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  /**
   * 最小化
   */
  mainOn(ipcNames.minimize, () => {
    win.minimize();
  });

    /**
   * 记录子进程pid
   */

  mainOn(ipcNames.add_child_process_name, (e, name) => {
    log.info("添加子进程name=" + name);
    global.modules.pidNames.push(name);
  });

  /**
   * 自动启动
   */
  autoLaunch(win);

  /**
   * 设置菜单
   */
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "设置",
        click: () => {
          mainSend(win, ipcNames.menu_cmd, {
            name: "setting",
          });
        },
      },
    ])
  );
};
