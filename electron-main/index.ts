import path from 'path'
import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import mainEvents from './events'
import autoUpdate from './autoUpdate'

log.transports.file.resolvePath = () => "./logs/main.log";

global.modules = {};
let win: BrowserWindow = global.modules.mainWindow;

function createWindow() {
  win = new BrowserWindow({
    minWidth: 1300,
    frame: false,
    // transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, '../electron-preload/index.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    mainEvents(win);
    autoUpdate(win);
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../index.html'))
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
    win.webContents.openDevTools({ mode: "detach" });
    win.loadURL(url)
  }
}

app.on('window-all-closed', () => {
  win = null
})

app.whenReady().then(createWindow)
