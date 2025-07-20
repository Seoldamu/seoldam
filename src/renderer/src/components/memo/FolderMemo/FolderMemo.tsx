import { IconButton, Row, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { memoSystemService } from '@renderer/services/memoSystemService'
import { useSeriesStore } from '@renderer/stores'
import { flex, formatDateToDotString } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import MemoItem from './MemoItem/MemoItem'

interface Memo {
  name: string
  path: string
  updateAt: string
}

const FolderMemo = () => {
  const { currentSeriesPath } = useSeriesStore()

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
  }, [currentSeriesPath])

  return (
    <StyledFolderMemo>
      <Row justifyContent="space-between">
        <Row width="60%" gap={4}>
          <Text fontType="T2" color={color.G900}>
            메모
          </Text>
        </Row>
        <IconButton onClick={() => {}}>새 메모</IconButton>
      </Row>
      <ScrollArea>
        <MemoList>
          {memoList.map((memo) => (
            <div key={memo.path} onClick={() => {}} style={{ width: '100%' }}>
              <MemoItem
                title={memo.name.replace(/\.md$/, '')}
                path={memo.path}
                updateAt={formatDateToDotString(new Date(memo.updateAt))}
              />
            </div>
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
