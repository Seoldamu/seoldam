import { registerAiHandlers } from './aiHandlers'
import { registerFileSystemHandlers } from './fileSystemHandlers'
import { registerMemoSystemHandlers } from './memoSysyemHandle'
import { registerSeriesHandlers } from './seriesHandlers'

export function registerIpcHandlers(): void {
  registerAiHandlers()
  registerFileSystemHandlers()
  registerSeriesHandlers()
  registerMemoSystemHandlers()
}
