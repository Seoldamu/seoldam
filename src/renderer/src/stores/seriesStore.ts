import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SeriesStore {
  currentSeriesPath: string | null
  setSeriesPath: (path: string) => void
}

const useSeriesStore = create<SeriesStore>()(
  persist<SeriesStore>(
    (set) => ({
      currentSeriesPath: null,
      setSeriesPath: (path) => set({ currentSeriesPath: path })
    }),
    {
      name: 'series-storage'
    }
  )
)

export default useSeriesStore
