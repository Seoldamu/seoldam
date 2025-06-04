import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { mkdirSync, existsSync, writeFileSync, copyFileSync, readdirSync, readFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createMetaJson, generateUniqueFilename } from './utils'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1296,
    height: 1024,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle('create-series', (_, seriesTitle: string, seriesImagePath: string) => {
  const userDataPath = app.getPath('userData')
  const seriesPath = join(userDataPath, 'series', seriesTitle)
  const metaPath = join(seriesPath, 'meta.json')
  const rootPath = join(seriesPath, 'root')
  const imageDir = join(seriesPath, 'image')

  try {
    if (existsSync(seriesPath)) {
      return { success: false, message: '이미 존재하는 작품입니다.' }
    }

    mkdirSync(seriesPath, { recursive: true })
    mkdirSync(rootPath, { recursive: true })
    mkdirSync(imageDir, { recursive: true })

    const ext = path.extname(seriesImagePath) || '.png'
    const destImageName = generateUniqueFilename(ext)
    const destImagePath = join(imageDir, destImageName)

    if (existsSync(seriesImagePath)) {
      copyFileSync(seriesImagePath, destImagePath)
    } else {
      return { success: false, message: '이미지 경로가 존재하지 않습니다.' }
    }

    const meta = createMetaJson(seriesTitle, `image/${destImageName}`)
    writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')

    return { success: true, path: seriesPath }
  } catch (err) {
    return { success: false, message: '폴더 및 파일 생성 중 오류 발생' }
  }
})

ipcMain.handle('get-series-list', () => {
  const userDataPath = app.getPath('userData')
  const seriesRoot = join(userDataPath, 'series')
  const seriesList: any[] = []

  if (!existsSync(seriesRoot)) {
    return []
  }

  const seriesDirs = readdirSync(seriesRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  for (const dir of seriesDirs) {
    const metaPath = join(seriesRoot, dir, 'meta.json')
    if (existsSync(metaPath)) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf-8'))
        seriesList.push(meta)
      } catch {}
    }
  }

  return seriesList
})
