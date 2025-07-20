import { useToastStore, ToastType } from '@renderer/stores'

export const useToast = () => {
  const addToast = useToastStore((state) => state.addToast)

  const toast = (type: ToastType, message: string) => {
    addToast(message, type)
  }

  return toast
}
