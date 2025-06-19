import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import {
  mkdirSync,
  existsSync,
  writeFileSync,
  copyFileSync,
  readdirSync,
  readFileSync,
  statSync
} from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createMetaJson, generateUniqueFilename } from './utils'
import path, { join } from 'node:path'
import fs from 'node:fs'

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
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  //dev 모드의 개발자 창
  mainWindow.loadURL('http://localhost:5173')
  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

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
    const filePath = path.join(userDataPath, relativePath)

    if (fs.existsSync(filePath)) {
      return net.fetch(`file://${filePath}`)
    }
    return new Response('Not Found', { status: 404 })
  })

  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.loadURL('http://localhost:5173')
  mainWindow.webContents.openDevTools()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

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
        const fullPath = join(seriesRoot, dir)

        seriesList.push({
          ...meta,
          path: fullPath
        })
      } catch {}
    }
  }

  return seriesList
})

ipcMain.handle('get-series-charCount-list', (_, date: { year: number; month: number }) => {
  const userDataPath = app.getPath('userData')
  const seriesRoot = join(userDataPath, 'series')
  const charCountsPath = join(seriesRoot, 'charCounts.json')

  if (!existsSync(seriesRoot)) {
    mkdirSync(seriesRoot, { recursive: true })
  }

  let charCounts: Record<number, Record<number, any[]>> = {}
  if (existsSync(charCountsPath)) {
    try {
      charCounts = JSON.parse(readFileSync(charCountsPath, 'utf-8'))
    } catch (err) {
      charCounts = {}
      writeFileSync(charCountsPath, JSON.stringify(charCounts, null, 2), 'utf-8')
    }
  } else {
    writeFileSync(charCountsPath, JSON.stringify(charCounts, null, 2), 'utf-8')
  }

  const year = date.year
  const month = date.month
  if (!charCounts[year]) charCounts[year] = {}
  if (!charCounts[year][month]) charCounts[year][month] = []

  return charCounts[year][month]
})

function readDirectoryRecursive(dirPath: string): any[] {
  const items = readdirSync(dirPath)
  return items.map((name) => {
    const fullPath = join(dirPath, name)
    const stats = statSync(fullPath)
    const isDirectory = stats.isDirectory()

    return {
      name,
      type: isDirectory ? 'folder' : 'file',
      path: fullPath,
      children: isDirectory ? readDirectoryRecursive(fullPath) : undefined
    }
  })
}

ipcMain.handle('read-series-structure', (_, seriesPath: string) => {
  const rootPath = join(seriesPath, 'root')
  try {
    const structure = readDirectoryRecursive(rootPath)
    return { success: true, structure }
  } catch (err) {
    return { success: false, message: '디렉토리 읽기 실패' }
  }
})
