import { ipcMain, app } from 'electron'
import {
  existsSync,
  statSync,
  unlinkSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync
} from 'fs'
import fs from 'node:fs'
import { join, dirname, basename } from 'path'
import { validatePathName } from '../utils'

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

const handleGetPathDirectory = (_, dirPath: string) => {
  try {
    if (!existsSync(dirPath)) {
      return { success: false, message: '경로가 존재하지 않습니다.' }
    }
    const structure = readDirectoryRecursive(dirPath)
    return { success: true, structure }
  } catch (err) {
    return { success: false, message: '디렉토리 읽기 실패' }
  }
}

const handleDeletePath = (_, targetPath: string) => {
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
}

const handleCreateFolder = (_, parentPath: string, name: string) => {
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
}

const handleCreateFile = (_, parentPath: string, name: string) => {
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
}

const handleRenamePath = (_, oldPath: string, newName: string) => {
  try {
    if (!fs.existsSync(oldPath)) {
      return { success: false, message: '파일 또는 폴더를 찾을 수 없습니다' }
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
}

const handleSaveFileContent = (_, filePath: string, content: string) => {
  try {
    writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  } catch (err) {
    console.error('Failed to save file content:', err)
    return { success: false, message: '파일 저장 실패', error: err }
  }
}

const handleGetFileInfo = (_, filePath: string) => {
  try {
    if (!existsSync(filePath)) {
      return { success: false, message: '파일이 존재하지 않습니다.' }
    }

    const stats = statSync(filePath)
    if (!stats.isFile()) {
      return { success: false, message: '지정된 경로가 파일이 아닙니다.' }
    }

    const fileName = basename(filePath)
    const content = readFileSync(filePath, 'utf-8')

    return {
      success: true,
      fileName: fileName,
      content: content,
      filePath: filePath,
      size: stats.size,
      lastModified: stats.mtime
    }
  } catch (err) {
    console.error('Failed to get file info:', err)
    return {
      success: false,
      message: '파일 정보를 가져오는 중 오류가 발생했습니다.',
      error: err
    }
  }
}

export function registerFileSystemHandlers(): void {
  ipcMain.handle('get-path-directory', handleGetPathDirectory)
  ipcMain.handle('delete-path', handleDeletePath)
  ipcMain.handle('create-folder', handleCreateFolder)
  ipcMain.handle('create-file', handleCreateFile)
  ipcMain.handle('rename-path', handleRenamePath)
  ipcMain.handle('save-file-content', handleSaveFileContent)
  ipcMain.handle('get-file-info', handleGetFileInfo)
}
