import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SeriesStore {
  currentSeriesPath: string | null
  setSeriesPath: (path: string) => void
  currentPath: string | null
  setCurrentPath: (path: string | null) => void
}

const useSeriesStore = create<SeriesStore>()(
  persist<SeriesStore>(
    (set) => ({
      currentSeriesPath: null,
      setSeriesPath: (path) => set({ currentSeriesPath: path }),
      currentPath: null,
      setCurrentPath: (path) => set({ currentPath: path })
    }),
    {
      name: 'series-storage'
    }
  )
)

export default useSeriesStore
