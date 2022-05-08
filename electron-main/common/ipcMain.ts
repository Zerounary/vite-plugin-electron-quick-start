import { ipcMain } from 'electron'
import names from './ipcNames'


export let mainOn = (name, callback) => {
  ipcMain.on(name, callback)
}
export let mainOnce = (name, callback) => {
  ipcMain.once(name, callback)
}
export let mainOff = (name, callback) => {
  ipcMain.removeListener(name, callback)
}
export let mainOffAll = name => {
  ipcMain.removeAllListeners(name)
}

export let mainHandle = (name, callback) => {
  ipcMain.handle(name, callback)
}
export let mainHandleOnce = (name, callback) => {
  ipcMain.handleOnce(name, callback)
}
export let mainHandleRemove = name => {
  ipcMain.removeListener(name, () => {});
}

export let mainSend = (window, name, params) => {
  window.webContents.send(name, params)
}

export let launchMainSend = (window, name, params) => {
  setTimeout(() => {
    window.webContents.send(name, params)
  }, 2000);
}

export let NAMES = names
