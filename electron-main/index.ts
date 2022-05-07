import path from 'path'
import { app, BrowserWindow } from 'electron'
import mainEvents from './events'

let win: BrowserWindow

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    transparent: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, '../electron-preload/index.js'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    mainEvents(win);
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
