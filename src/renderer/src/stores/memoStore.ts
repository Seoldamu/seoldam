import { create } from 'zustand'

interface MemoState {
  currentMemoPath: string | null
  setCurrentMemoPath: (path: string | null) => void
}

const useMemoStore = create<MemoState>((set) => ({
  currentMemoPath: null,
  setCurrentMemoPath: (path) => set({ currentMemoPath: path }),
}))

export default useMemoStore
