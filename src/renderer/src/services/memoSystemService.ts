export const memoSystemService = {
  getMemoList: (seriesPath: string) => {
    return window.api.memo.getMemoList(seriesPath)
  },
  createMemoFile: (seriesPath: string) => {
    return window.api.memo.createMemoFile(seriesPath)
  }
}
