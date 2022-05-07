import path from 'path'
import fs from 'fs'
import { ipcRenderer } from 'electron'
import ipcNames from '~/electron-main/common/ipcNames'

console.log(Date.now())

// Use ipcRenderer.on
ipcRenderer.on(ipcNames.Test, (_event, message) => {
  console.log('[Receive Main-process message]:', message)
  console.log('[path]', path)
  console.log('[fs]', fs)
})
