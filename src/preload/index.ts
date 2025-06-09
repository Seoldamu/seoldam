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

  getPathForFile: (file) => webUtils.getPathForFile(file)
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
