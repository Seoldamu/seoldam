import fs from 'node:fs'
import { join } from 'node:path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, protocol, net } from 'electron'

import icon from '../../resources/icon.png?asset'

import { registerIpcHandlers } from './ipc'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'seoldam',
    privileges: {
      standard: true,
      secure: true,
      bypassCSP: true,
      supportFetchAPI: true
    }
  }
])

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1296,
    height: 1024,
    show: false,
    autoHideMenuBar: true,
    icon: icon,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  protocol.handle('seoldam', async (request) => {
    const url = new URL(request.url)
    const fullPath = `/${url.host}${url.pathname}`
    const decodedPath = decodeURIComponent(fullPath)

    const relativePath = decodedPath.replace(/^\/+/, '')
    const userDataPath = app.getPath('userData')
    const filePath = join(userDataPath, relativePath)

    if (fs.existsSync(filePath)) {
      return net.fetch(`file://${filePath}`)
    }
    return new Response('Not Found', { status: 404 })
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
