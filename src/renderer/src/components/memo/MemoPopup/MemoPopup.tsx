import { Column, Text } from '@renderer/components/common'
import { IconClose } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { memoSystemService } from '@renderer/services/memoSystemService'
import { useMemoPopupStore, useSeriesStore } from '@renderer/stores'
import { Memo } from '@renderer/types/memo/type'
import { flex, formatDateToDotString, getDisplayFilePath } from '@renderer/utils'
import { useEffect, useState, useRef } from 'react'
import { styled } from 'styled-components'
import MemoItem from './MemoItem/MemoItem'
import MemoViewer from './MemoViewer/MemoViewer'

const MemoPopup = () => {
  const { currentSeriesPath } = useSeriesStore()
  const { position, closeMemoPopup } = useMemoPopupStore()
  const [currentMemoPath, setCurrentMemoPath] = useState<string | null>(null)
  const [memoList, setMemoList] = useState<Memo[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentPosition, setCurrentPosition] = useState(position || { x: 0, y: 0 })
  const popupRef = useRef<HTMLDivElement>(null)

  const fetchMemoList = async () => {
    if (!currentSeriesPath) return
    const result = await memoSystemService.getMemoList(currentSeriesPath)
    if (result.success) {
      setMemoList(result.memos)
    } else {
      console.error('Failed to fetch memo list:', result.message)
    }
  }

  useEffect(() => {
    fetchMemoList()
  }, [currentSeriesPath, currentMemoPath])

  useEffect(() => {
    if (position) {
      setCurrentPosition(position)
    }
  }, [position])

  const handleMemoClick = (path: string) => {
    setCurrentMemoPath(path)
  }

  const handleClose = () => {
    setCurrentMemoPath(null)
    closeMemoPopup()
  }

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('svg') || (e.target as Element).closest('[role="button"]')) {
      return
    }

    e.preventDefault()
    setIsDragging(true)

    const rect = popupRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      e.preventDefault()

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      const maxX = window.innerWidth - 376
      const maxY = window.innerHeight - 427

      setCurrentPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)

      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragOffset])

  return (
    <>
      <StyledMemoPopup
        ref={popupRef}
        style={{
          left: `${currentPosition.x}px`,
          top: `${currentPosition.y}px`
        }}
        $isDragging={isDragging}
      >
        <HeaderRow onMouseDown={handleHeaderMouseDown}>
          <Text fontType="T4" color={color.G900}>
            메모
          </Text>
          <IconClose onClick={handleClose} style={{ cursor: 'pointer' }} />
        </HeaderRow>

        <ContentArea>
          {!currentMemoPath ? (
            <ScrollArea>
              <Column width="100%" alignItems="center">
                {memoList.map((memo) => (
                  <div
                    key={memo.path}
                    onClick={() => handleMemoClick(memo.path)}
                    style={{ width: '100%' }}
                  >
                    <MemoItem
                      title={getDisplayFilePath(memo.name)}
                      path={memo.path}
                      updateAt={formatDateToDotString(new Date(memo.updateAt))}
                    />
                  </div>
                ))}
              </Column>
            </ScrollArea>
          ) : (
            <MemoViewer currentMemoPath={currentMemoPath} setCurrentMemoPath={setCurrentMemoPath} />
          )}
        </ContentArea>
      </StyledMemoPopup>
    </>
  )
}

export default MemoPopup

const StyledMemoPopup = styled.div<{ $isDragging: boolean }>`
  position: fixed;
  z-index: 1000;
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  gap: 8px;
  width: 376px;
  height: 427px;
  border-radius: 8px;
  background: ${color.G0};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  user-select: none;
  transition: ${({ $isDragging }) => ($isDragging ? 'none' : 'box-shadow 0.2s ease')};

  &:hover {
    box-shadow: ${({ $isDragging }) =>
      $isDragging ? '0px 4px 20px rgba(0, 0, 0, 0.15)' : '0px 6px 25px rgba(0, 0, 0, 0.2)'};
  }
`

const HeaderRow = styled.div`
  ${flex({ justifyContent: 'space-between', alignItems: 'center' })}
  width: 100%;
  padding: 14px 12px 0px 12px;
  cursor: grab;
  background: ${color.G0};

  &:active {
    cursor: grabbing;
  }

  &:active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.02);
    pointer-events: none;
  }
`

const ContentArea = styled.div`
  flex: 1;
  width: 100%;
  padding: 0px 12px 20px 12px;
  overflow: hidden;
  ${flex({ flexDirection: 'column' })}
`

const ScrollArea = styled.div`
  flex-grow: 1 0 0;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G40};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${color.G80};
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`
