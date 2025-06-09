import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type TodayCharCountStore = {
  todayCharCount: number
  setTodayCharCount: (value: number) => void
}

const useTodayCharCountStore = create<TodayCharCountStore>()(
  persist(
    (set) => ({
      todayCharCount: 0,
      setTodayCharCount: (newValue: number) => set({ todayCharCount: newValue })
    }),
    {
      name: 'today-char-count',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useTodayCharCountStore
