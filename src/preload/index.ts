import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

interface CreateSeriesResult {
  success: boolean
  path: string
  message: string
}

const api = {
  createSeries: (seriesName: string, seriesImagePath: string): Promise<CreateSeriesResult> =>
    ipcRenderer.invoke('create-series', seriesName, seriesImagePath),

  getSeriesList: (): Promise<any[]> => ipcRenderer.invoke('get-series-list'),

  getSeriesCharCountsList: (date: { year: number; month: number }): Promise<any[]> =>
    ipcRenderer.invoke('get-series-charCount-list', date),

  getPathForFile: (file) => webUtils.getPathForFile(file),

  getSeriesRootDirectory: (seriesPath: string) =>
    ipcRenderer.invoke('get-series-root-directory', seriesPath),

  getPathDirectory: (dirPath: string) => ipcRenderer.invoke('get-path-directory', dirPath),

  deleteSeriesTargetPath: (targetPath: string) => ipcRenderer.invoke('delete-path', targetPath),

  createFolder: (targetPath: string, name: string) =>
    ipcRenderer.invoke('create-folder', targetPath, name),

  createFile: (targetPath: string, name: string) =>
    ipcRenderer.invoke('create-file', targetPath, name),

  renamePath: (targetPath: string, name: string) =>
    ipcRenderer.invoke('rename-path', targetPath, name),

  saveFileContent: (filePath: string, content: string) =>
    ipcRenderer.invoke('save-file-content', filePath, content),

  getFileInfo: (filePath: string) => ipcRenderer.invoke('get-file-info', filePath)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  // context isolation이 꺼진 경우(개발용 등)
  // @ts-ignore - 글로벌 확장 정의에서 타입 맞춰줘야 함
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
