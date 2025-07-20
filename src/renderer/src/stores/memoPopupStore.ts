import { create } from 'zustand'

interface MemoPopupState {
  isOpen: boolean
  position: { x: number; y: number } | null
  openMemoPopup: (position?: { x: number; y: number }) => void
  closeMemoPopup: () => void
}

const useMemoPopupStore = create<MemoPopupState>((set) => ({
  isOpen: false,
  position: null,
  openMemoPopup: (position = { x: window.innerWidth / 2 - 188, y: 100 }) =>
    set({ isOpen: true, position }),
  closeMemoPopup: () => set({ isOpen: false, position: null })
}))

export default useMemoPopupStore
