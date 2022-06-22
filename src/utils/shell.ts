import ipcNames from '~/electron-main/common/ipcNames';
import { rendererSend } from '~/electron-main/common/ipcRender';
import { binPath } from "./path";
import log from "electron-log";

const { exec } = require("child_process");

export const run = (cmd: string, cb?) => {
  if (!cb) {
    cb = (error, stdout, stderr) => {
      if (error) {
        log.error(`exec error: ${error}`);
        return;
      }
      log.info(`stdout: ${stdout}`);
      log.error(`stderr: ${stderr}`);
    };
  }
  let child = exec(
    cmd,
    {
      cwd: binPath,
    },
    cb
  );
  rendererSend(ipcNames.add_child_process_name, cmd.split(' ')[0]);
  return child;
};

