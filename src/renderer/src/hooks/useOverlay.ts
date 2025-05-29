import { useState, useCallback, useMemo } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const useOverlay = (render: (props: Props) => React.ReactNode) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = useCallback(() => setIsOpen(false), [])
  const handleOpen = useCallback(() => setIsOpen(true), [])

  const Overlay = useMemo(
    () => (isOpen ? render({ isOpen, onClose }) : null),
    [isOpen, render, onClose]
  )

  return { isOpen, onClose, handleOpen, Overlay }
}

export default useOverlay
