import log from 'electron-log'
import ipcNames from "../common/ipcNames"

export default (win) => {
  log.info(ipcNames.Test);
  log.info(typeof ipcNames.Test);
  win?.webContents.send(ipcNames.Test, (new Date).toLocaleString())
}