import { seriesService } from '@renderer/services/seriesService'
import { SeriesListItem } from '@renderer/types/series/type'
import { create } from 'zustand'

interface SeriesListStore {
  seriesList: SeriesListItem[]
  setSeriesList: (list: SeriesListItem[]) => void
  fetchSeriesList: () => Promise<void>
}

const useSeriesListStore = create<SeriesListStore>((set) => ({
  seriesList: [],
  setSeriesList: (list) => set({ seriesList: list }),
  fetchSeriesList: async () => {
    const list = await seriesService.getList()
    set({ seriesList: list })
  }
}))

export default useSeriesListStore
