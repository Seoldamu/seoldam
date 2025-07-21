import { IconButton, Row, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { memoSystemService } from '@renderer/services/memoSystemService'
import { useMemoStore, useSeriesStore } from '@renderer/stores'
import { flex, formatDateToDotString, getDisplayFilePath } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { FileMemo } from '..'
import MemoItem from './MemoItem/MemoItem'
import { useToast } from '@renderer/hooks'
import { Memo } from '@renderer/types/memo/type'

const FolderMemo = () => {
  const { currentSeriesPath } = useSeriesStore()
  const { currentMemoPath, setCurrentMemoPath } = useMemoStore()
  const [memoList, setMemoList] = useState<Memo[]>([])

  const toast = useToast()

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

  const handleNewMemo = async () => {
    if (!currentSeriesPath) return
    const result = await memoSystemService.createMemoFile(currentSeriesPath)
    if (result.success) {
      setCurrentMemoPath(result.path)
      toast('SUCCESS', '메모가 생성되었습니다')
    }
  }

  const handleMemoClick = (path: string) => {
    setCurrentMemoPath(path)
  }

  if (currentMemoPath) {
    return <FileMemo />
  }

  return (
    <StyledFolderMemo>
      <Row justifyContent="space-between">
        <Row width="60%" gap={4}>
          <Text fontType="T2" color={color.G900}>
            메모
          </Text>
        </Row>
        <IconButton onClick={handleNewMemo}>새 메모</IconButton>
      </Row>
      <ScrollArea>
        <MemoList>
          {memoList.map((memo) => (
            <MemoItem
              key={memo.path}
              title={getDisplayFilePath(memo.name)}
              path={memo.path}
              updateAt={formatDateToDotString(new Date(memo.updateAt))}
              onClick={() => handleMemoClick(memo.path)}
              fetchMemoList={() => fetchMemoList()}
            />
          ))}
        </MemoList>
      </ScrollArea>
    </StyledFolderMemo>
  )
}

export default FolderMemo

const StyledFolderMemo = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  height: 100vh;
  padding: 68px 205px 0px 72px;
  gap: 38px;
  background: ${color.G0};
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

const MemoList = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
`
