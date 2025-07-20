import {
  existsSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readdirSync,
  readFileSync,
  statSync
} from 'fs'
import { join, extname } from 'path'

import { app, ipcMain } from 'electron'

import { createMetaJson, generateUniqueFilename } from '../utils'

const handleCreateSeries = (_, seriesTitle: string, seriesImagePath: string) => {
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
    mkdirSync(join(seriesPath, 'memo'), { recursive: true })

    const ext = extname(seriesImagePath) || '.png'
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
}

const handleGetSeriesList = () => {
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
}

const handleGetSeriesCharCountList = (_, date: { year: number; month: number }) => {
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
}

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

const handleGetSeriesRootDirectory = (_, seriesPath: string) => {
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
}

export function registerSeriesHandlers(): void {
  ipcMain.handle('create-series', handleCreateSeries)
  ipcMain.handle('get-series-list', handleGetSeriesList)
  ipcMain.handle('get-series-charCount-list', handleGetSeriesCharCountList)
  ipcMain.handle('get-series-root-directory', handleGetSeriesRootDirectory)
}
