import { autoUpdater } from "electron-updater";
import log from "electron-log";
import { mainSend, mainOn } from "./common/ipcMain"
import ipcNames from './common/ipcNames'

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

log.info("autoUpdate 启动");

export default (win) => {
  autoUpdater.on("checking-for-update", () => {
    log.info("checking-for-update 正在检查更新");
  });
  autoUpdater.on("update-available", (info) => {
    log.info("update-available", info);
    mainSend(win, ipcNames.update_available, info);

  });
  autoUpdater.on("update-not-available", (info) => {
    log.info("update-not-available", info);
    mainSend(win, ipcNames.update_not_available, info);
  });
  autoUpdater.on("error", (err) => {
    mainSend(win, ipcNames.update_error, err.message);
  });
  autoUpdater.on("download-progress", (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message =
      log_message +
      " (" +
      progressObj.transferred +
      "/" +
      progressObj.total +
      ")";
    log.info(log_message);
    mainSend(win, ipcNames.update_progress, progressObj);
  });
  autoUpdater.on("update-downloaded", (info) => {
    mainSend(win, ipcNames.update_downloaded, info);
    // autoUpdater.quitAndInstall();
  });

  mainOn(ipcNames.quit_update, () => {
    global.isQuitting = true;

    setTimeout(() => {
      autoUpdater.quitAndInstall(); // 用户手动安装，可指定安装目录
      // autoUpdater.quitAndInstall(true, true) // 自动安装更新并重启，使用当前已安装的目录
    }, 1000);
  });

  autoUpdater.checkForUpdates();
};
