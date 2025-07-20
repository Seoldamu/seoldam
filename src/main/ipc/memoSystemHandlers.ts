import { existsSync, statSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

import { ipcMain } from 'electron'

const handleGetMemoList = (_, seriesPath: string) => {
  const memoPath = join(seriesPath, 'memo')
  if (!existsSync(memoPath)) {
    return { success: true, memos: [] }
  }

  try {
    const memoFiles = readdirSync(memoPath)
      .map((file) => {
        const filePath = join(memoPath, file)
        const stats = statSync(filePath)
        return {
          name: file,
          path: filePath,
          updateAt: stats.mtime
        }
      })
      .sort((a, b) => b.updateAt.getTime() - a.updateAt.getTime())

    return { success: true, memos: memoFiles }
  } catch (err) {
    console.error('Failed to get memo list:', err)
    return { success: false, message: '메모 목록을 가져오지 못했습니다.', error: err }
  }
}

const handleCreateMemoFile = (_, seriesPath: string) => {
  try {
    const memoPath = join(seriesPath, 'memo')
    const baseName = '새 메모.md'
    let count = 1
    let newPath = join(memoPath, baseName)

    while (existsSync(newPath)) {
      newPath = join(memoPath, `새 메모 (${count++}).md`)
    }

    writeFileSync(newPath, '# 새 메모')
    return { success: true, path: newPath }
  } catch (err) {
    return { success: false, message: '메모 파일 생성 실패', error: err }
  }
}

export function registerMemoSystemHandlers(): void {
  ipcMain.handle('get-memo-list', handleGetMemoList)
  ipcMain.handle('create-memo-file', handleCreateMemoFile)
}
