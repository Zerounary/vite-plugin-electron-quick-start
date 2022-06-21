import log from "electron-log";
import { app } from "electron";
import { mainSend, mainOn } from "../common/ipcMain";
import ipcNames from "../common/ipcNames";

export default (win) => {
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
};
