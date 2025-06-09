import { Month } from '@renderer/types/home/type'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type MonthStore = {
  compareMonth: Month
  comparedMonth: Month
  setCompareMonth: (month: Month) => void
  setComparedMonth: (month: Month) => void
}

const useMonthStore = create<MonthStore>()(
  persist(
    (set) => ({
      compareMonth: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
      comparedMonth: { year: new Date().getFullYear(), month: new Date().getMonth() + 1 },
      setCompareMonth: (month) => set({ compareMonth: month }),
      setComparedMonth: (month) => set({ comparedMonth: month })
    }),
    {
      name: 'chart-month-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useMonthStore
