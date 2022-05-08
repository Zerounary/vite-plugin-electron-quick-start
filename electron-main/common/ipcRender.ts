import { ipcRenderer } from 'electron'
import names from './ipcNames'

export let mainSend = (window, name, params) => {
  window.webContents.send(name, params)
}

export let launchMainSend = (window, name, params) => {
  setTimeout(() => {
    window.webContents.send(name, params)
  }, 2000);
}

export let rendererSend = (name, params) => {
  ipcRenderer.send(name, params)
}
export let rendererSendSync = (name, params) => ipcRenderer.sendSync(name, params)

export let rendererInvoke = (name, params) => ipcRenderer.invoke(name, params)

export let rendererOn = (name, callback) => {
  ipcRenderer.on(name, callback)
}
export let rendererOnce = (name, callback) => {
  ipcRenderer.once(name, callback)
}
export let rendererOff = (name, callback) => {
  ipcRenderer.removeListener(name, callback)
}
export let rendererOffAll = name => {
  ipcRenderer.removeAllListeners(name)
}

export let NAMES = names
