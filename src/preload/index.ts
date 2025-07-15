import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  ai: {
    askChatbot: (prompt: string, seriesPath: string | null): Promise<string> =>
      ipcRenderer.invoke('ask-chatbot', prompt, seriesPath)
  },
  series: {
    create: (seriesName: string, seriesImagePath: string): Promise<any> =>
      ipcRenderer.invoke('create-series', seriesName, seriesImagePath),
    getList: (): Promise<any[]> => ipcRenderer.invoke('get-series-list'),
    getCharCountsList: (date: { year: number; month: number }): Promise<any[]> =>
      ipcRenderer.invoke('get-series-charCount-list', date),
    getRootDirectory: (seriesPath: string) =>
      ipcRenderer.invoke('get-series-root-directory', seriesPath)
  },
  fs: {
    getDirectory: (dirPath: string) => ipcRenderer.invoke('get-path-directory', dirPath),
    delete: (targetPath: string) => ipcRenderer.invoke('delete-path', targetPath),
    createFolder: (targetPath: string, name: string) =>
      ipcRenderer.invoke('create-folder', targetPath, name),
    createFile: (targetPath: string, name: string) =>
      ipcRenderer.invoke('create-file', targetPath, name),
    rename: (targetPath: string, name: string) =>
      ipcRenderer.invoke('rename-path', targetPath, name),
    saveFile: (filePath: string, content: string) =>
      ipcRenderer.invoke('save-file-content', filePath, content),
    getFileInfo: (filePath: string) => ipcRenderer.invoke('get-file-info', filePath),
    getPathForFile: (file: File) => webUtils.getPathForFile(file)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Failed to expose APIs:', error)
  }
} else {
  // @ts-ignore (define in d.ts)
  window.electron = electronAPI
  // @ts-ignore (define in d.ts)
  window.api = api
}
