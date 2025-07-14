import { create } from 'zustand'
import { TreeNode } from '@renderer/types/series/type'
import useSeriesStore from './seriesStore'

interface SeriesTreeStore {
  treeData: TreeNode[]
  setTreeData: (data: TreeNode[]) => void
  fetchTreeData: () => Promise<void>
}

const useSeriesTreeStore = create<SeriesTreeStore>((set) => ({
  treeData: [],
  setTreeData: (data) => set({ treeData: data }),

  fetchTreeData: async () => {
    const currentSeriesPath = useSeriesStore.getState().currentSeriesPath
    if (!currentSeriesPath) return

    const result = await window.api.getSeriesRootDirectory(currentSeriesPath)
    if (result.success) {
      set({ treeData: result.structure })
    }
  }
}))

export default useSeriesTreeStore
