import { binPath } from "./path";
import log from "electron-log";

const { exec } = require("child_process");

export const run = (cmd, cb?) => {
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
  return exec(
    cmd,
    {
      cwd: binPath,
    },
    cb
  );
};
