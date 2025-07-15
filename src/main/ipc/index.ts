
import { registerAiHandlers } from './aiHandlers'
import { registerFileSystemHandlers } from './fileSystemHandlers'
import { registerSeriesHandlers } from './seriesHandlers'

export function registerIpcHandlers(): void {
  registerAiHandlers()
  registerFileSystemHandlers()
  registerSeriesHandlers()
}
