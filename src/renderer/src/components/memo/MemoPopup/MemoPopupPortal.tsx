import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import MemoPopup from './MemoPopup'
import { useMemoPopupStore, useSeriesStore } from '@renderer/stores'
import { useMemo } from 'react'

const MemoPopupPortal = () => {
  const { currentPath } = useSeriesStore()
  const { isOpen } = useMemoPopupStore()
  const location = useLocation()

  const isFolder = useMemo(() => {
    if (!currentPath) return false
    return !currentPath.endsWith('.md')
  }, [currentPath])

  if (!isOpen || location.pathname !== '/editor' || isFolder) return null

  return createPortal(<MemoPopup />, document.body)
}

export default MemoPopupPortal
