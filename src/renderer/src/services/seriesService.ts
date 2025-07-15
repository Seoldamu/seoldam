export const seriesService = {
  create: (seriesName: string, seriesImagePath: string) => {
    return window.api.series.create(seriesName, seriesImagePath)
  },
  getList: () => {
    return window.api.series.getList()
  },
  getCharCountsList: (date: { year: number; month: number }) => {
    return window.api.series.getCharCountsList(date)
  },
  getRootDirectory: (seriesPath: string) => {
    return window.api.series.getRootDirectory(seriesPath)
  }
}
