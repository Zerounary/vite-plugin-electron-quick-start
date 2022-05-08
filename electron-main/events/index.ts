import log from 'electron-log'
import { app } from 'electron'
import {mainSend, mainOn} from "../common/ipcMain"
import ipcNames from "../common/ipcNames"

export default (win) => {
  mainSend(win, ipcNames.Test,(new Date).toLocaleString())
  mainOn(ipcNames.quit, (event, message) => {
    app.quit()
  }) 
}