import { Column, Row, Text } from '@renderer/components/common'
import { IconClose } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { memoSystemService } from '@renderer/services/memoSystemService'
import { useMemoStore, useSeriesStore } from '@renderer/stores'
import { Memo } from '@renderer/types/memo/type'
import { flex, formatDateToDotString } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import MemoItem from './MemoItem/MemoItem'

const MemoPopup = () => {
  const { currentSeriesPath } = useSeriesStore()
  const { currentMemoPath, setCurrentMemoPath } = useMemoStore()
  const [memoList, setMemoList] = useState<Memo[]>([])

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

  const handleMemoClick = (path: string) => {
    setCurrentMemoPath(path)
  }

  return (
    <StyledMemoPopup>
      <Row justifyContent="space-between" alignItems="center">
        <Text fontType="T4" color={color.G900}>
          메모
        </Text>
        <IconClose />
      </Row>
      <ScrollArea>
        <Column width="100%" alignItems="center">
          {memoList.map((memo) => (
            <div
              key={memo.path}
              onClick={() => handleMemoClick(memo.path)}
              style={{ width: '100%' }}
            >
              <MemoItem
                title={memo.name.replace(/\.md$/, '')}
                path={memo.path}
                updateAt={formatDateToDotString(new Date(memo.updateAt))}
              />
            </div>
          ))}
        </Column>
      </ScrollArea>
    </StyledMemoPopup>
  )
}

export default MemoPopup

const StyledMemoPopup = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 376px;
  height: 427px;
  padding: 14px 12px 20px 12px;
  gap: 8px;
  flex-shrink: 0;

  border-radius: 8px;
  background: ${color.G0};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
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
