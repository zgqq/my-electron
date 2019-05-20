'use strict'

import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function getOrCreateMainWindow () {
  if (mainWindow) {
    return mainWindow
  }
  newWindow()
  return mainWindow
}

function newWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 80,
    useContentSize: true,
    width: 600,
    center: true,
    skipTaskbar: true,
    webPreferences: {
			devTools: false,
      pageVisibility: true,
      backgroundThrottling: false,
			webSecurity: false
    },
    frame: false,
    toolbar: false
  })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.setAutoHideMenuBar(true)

  mainWindow.loadURL(winURL)
  app.dock.hide()

//   mainWindow.on('close', event => {
//     console.log(event)
//     event.preventDefault()
//     mainWindow.hide()
//     // app.hide() //     // mainWindow = null
//   })
// }

function createWindow () {
  mainWindow = getOrCreateMainWindow()
  // globalShortcut.register('cmd+w', function () {
  //   app.hide()
  // })
  ipcMain.on('resize', (event, x, y) => {
    console.log('resize')
    mainWindow.setSize(x, y)
    // mainWindow.show()
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

  ipcMain.on('hide-app', (event, args) => {
    console.log('hide app')
    app.hide()
    // mainWindow.show()
  })

  globalShortcut.register('cmd+ctrl+l', function () {
    console.log('lo')
    // ipcRenderer.sendSync('synchronous-message', 'ping')
    mainWindow = getOrCreateMainWindow()
    console.log('receive shortcut')
    mainWindow.webContents.send('synchronous-message', 'confirm')
    setTimeout(() => {
      mainWindow.show()
    }, 100)
  })
  ipcMain.on('page-loaded', (event, args) => {
    console.log('l-page-loaded')
    // mainWindow.show()
  })

  globalShortcut.register('cmd+ctrl+e', function () {
    console.log('lo')
    // ipcRenderer.sendSync('synchronous-message', 'ping')
    mainWindow = getOrCreateMainWindow()
    mainWindow.webContents.send('synchronous-message', 'search')
    setTimeout(() => {
      mainWindow.show()
    }, 100)
  })
  ipcMain.on('page-loaded', (event, args) => {
    console.log('page-loaded')
    // mainWindow.show()
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
