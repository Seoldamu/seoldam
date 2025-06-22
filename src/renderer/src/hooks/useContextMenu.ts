import { useCallback, useState } from 'react'

const useContextMenu = () => {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const open = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setVisible(true)
    setPosition({ x: e.clientX, y: e.clientY })
  }, [])

  const close = useCallback(() => {
    setVisible(false)
  }, [])

  return {
    contextMenuVisible: visible,
    contextMenuPosition: position,
    openContextMenu: open,
    closeContextMenu: close
  }
}

export default useContextMenu
