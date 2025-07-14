import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import {
  mkdirSync,
  existsSync,
  writeFileSync,
  copyFileSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync
} from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createMetaJson, generateUniqueFilename, validatePathName } from './utils'
import path, { join } from 'node:path'
import fs from 'node:fs'
import { dirname } from 'path'

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

        const coverImageUrl = `seoldam://series/${encodeURIComponent(meta.title)}/${
          meta.coverImagePath
        }`

        seriesList.push({
          ...meta,
          path: fullPath,
          coverImagePath: coverImageUrl
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
    const isFile = stats.isFile()

    const node: any = {
      id: fullPath,
      name,
      type: isDirectory ? 'folder' : 'file',
      path: fullPath,
      children: isDirectory ? readDirectoryRecursive(fullPath) : undefined
    }

    if (isFile) {
      try {
        node.content = readFileSync(fullPath, 'utf-8')
      } catch (e) {
        node.content = ''
      }
    }

    return node
  })
}

ipcMain.handle('get-series-root-directory', (_, seriesPath: string) => {
  const rootPath = join(seriesPath, 'root')
  try {
    if (!existsSync(rootPath)) {
      return { success: false, message: 'Root 디렉토리를 찾을 수 없습니다.' }
    }
    const structure = readDirectoryRecursive(rootPath)
    return { success: true, structure }
  } catch (err) {
    return { success: false, message: '디렉토리 읽기 실패' }
  }
})

ipcMain.handle('get-path-directory', (_, dirPath: string) => {
  try {
    if (!existsSync(dirPath)) {
      return { success: false, message: '경로가 존재하지 않습니다.' }
    }
    const structure = readDirectoryRecursive(dirPath)
    return { success: true, structure }
  } catch (err) {
    return { success: false, message: '디렉토리 읽기 실패' }
  }
})

ipcMain.handle('delete-path', (_, targetPath: string) => {
  try {
    const stats = statSync(targetPath)

    if (stats.isDirectory()) {
      fs.rmSync(targetPath, { recursive: true, force: true })
    } else {
      unlinkSync(targetPath)
    }

    return { success: true }
  } catch (err) {
    return { success: false, message: '삭제 실패', error: err }
  }
})

ipcMain.handle('create-folder', (_, parentPath: string, name: string) => {
  try {
    let baseName = name || '새 폴더'
    let count = 1
    let newPath = join(parentPath, baseName)

    while (fs.existsSync(newPath)) {
      newPath = join(parentPath, `${baseName} (${count++})`)
    }

    mkdirSync(newPath)
    return { success: true, path: newPath }
  } catch (err) {
    return { success: false, message: '폴더 생성 실패', error: err }
  }
})

ipcMain.handle('create-file', (_, parentPath: string, name: string) => {
  try {
    let baseName = name || '새 파일'
    let count = 1
    let newPath = join(parentPath, baseName)

    while (fs.existsSync(newPath)) {
      newPath = join(parentPath, `${baseName} (${count++})`)
    }

    writeFileSync(newPath, '새 파일')
    return { success: true, path: newPath }
  } catch (err) {
    return { success: false, message: '파일 생성 실패', error: err }
  }
})

ipcMain.handle('rename-path', (_, oldPath: string, newName: string) => {
  try {
    if (!fs.existsSync(oldPath)) {
      return { success: false, message: '파일 또는 폴더를 찾을 수 없습��다' }
    }

    const validation = validatePathName(newName)
    if (!validation.isValid) {
      return { success: false, message: validation.message }
    }

    const parentDir = dirname(oldPath)
    const newPath = join(parentDir, newName)

    if (oldPath === newPath) {
      return { success: true, path: newPath, message: '동일한 이름입니다' }
    }

    if (fs.existsSync(newPath)) {
      return { success: false, message: '이미 존재하는 이름입니다' }
    }

    fs.renameSync(oldPath, newPath)

    const seriesRoot = join(app.getPath('userData'), 'series')
    const isSeriesDir = parentDir === seriesRoot

    if (isSeriesDir && fs.existsSync(newPath)) {
      const metaPath = join(newPath, 'meta.json')
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
          meta.title = newName
          fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')
        } catch (e) {
          console.error('Failed to update meta.json:', e)
        }
      }
    }

    return { success: true, path: newPath, oldPath, message: '이름이 변경되었습니다' }
  } catch (err) {
    console.error('Rename error:', err)
    return { success: false, message: '이름 변경 실패', error: err }
  }
})
