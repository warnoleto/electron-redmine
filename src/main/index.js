'use strict'

import { app, Tray, Menu, BrowserWindow, ipcMain } from 'electron'
import notifier from 'node-notifier'
import fileWatcher from './file-watcher'
const path = require('path')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let tray
let mainWindow
const trayIcon = path.join(__static, '/icon.ico')
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', (event) => {
    console.log(app.isQuiting)
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
    return false
  })

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir', click: () => mainWindow.show() },
    {
      label: 'Sair',
      click: () => {
        app.isQuiting = true
        app.quit()
      } }
  ])
  tray = new Tray(trayIcon)
  tray.setToolTip('Electron Redmine Desktop.')
  tray.setTitle('Electron Redmine')
  tray.setContextMenu(contextMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    notifier.notify({
      title: 'Electron Redmine',
      message: 'Nao se preocupe ainda estou aqui!',
      icon: trayIcon,
      sound: true,
      timeout: 1
    })
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('request-fs-watch', (event, data) => {
  fileWatcher.registerAll(data, (event, filename) => console.log(filename))
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
