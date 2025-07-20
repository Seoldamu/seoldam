import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ai: {
        askChatbot: (prompt: string, seriesPath: string | null) => Promise<string>
      }
      series: {
        create: (seriesName: string, seriesImagePath: string) => Promise<any>
        getList: () => Promise<any[]>
        getCharCountsList: (date: { year: number; month: number }) => Promise<any[]>
        getRootDirectory: (seriesPath: string) => Promise<any>
      }
      fs: {
        getDirectory: (dirPath: string) => Promise<any>
        delete: (targetPath: string) => Promise<any>
        createFolder: (targetPath: string, name: string) => Promise<any>
        createFile: (targetPath: string, name: string) => Promise<any>
        rename: (targetPath: string, name: string) => Promise<any>
        saveFile: (filePath: string, content: string) => Promise<any>
        getFileInfo: (filePath: string) => Promise<any>
        getPathForFile: (file: File) => Promise<string>
      }
      memo: {
        getMemoList: (seriesPath: string) => Promise<any>
        createMemoFile: (seriesPath: string) => Promise<any>
      }
    }
  }
}

export {}
