var AutoLaunch = require("auto-launch");
import { app } from "electron";
import pkg from "../../package.json";
import log from "electron-log";
import { getStore } from "../common/store";
import ipcNames from "../common/ipcNames";
import { mainHandle, mainOn, mainSend } from "../common/ipcMain";

var launcher = new AutoLaunch({
  name: pkg.description,
  path: app.getPath("exe"),
});

export default (mainWindow) => {
  // 向页面发送开机状态
  let setStatus = (isEnabled) =>
    mainSend(mainWindow, ipcNames.update_launch_status, isEnabled);

  mainOn(ipcNames.auto_launch_enable, () => {
    launcher.enable();
    setStatus(true);
  });

  mainOn(ipcNames.auto_launch_disable, () => {
    launcher.disable();
    setStatus(false);
  });

  mainHandle(ipcNames.auto_launch_status, () => {
    return launcher.isEnabled();
  });

  // 每次启动同步开机启动状态
  launcher.isEnabled().then((isEnabled) => {
    log.info("isFirst", getStore("app").get("isFirstStart"));
    if (getStore("app").get("isFirstStart")) {
      isEnabled = pkg.autoLaunch;
      isEnabled && launcher.enable();
    }
    mainWindow.webContents.send(ipcNames.update_launch_status, isEnabled);
    log.info("程序开机启动: " + isEnabled);
  });
};
