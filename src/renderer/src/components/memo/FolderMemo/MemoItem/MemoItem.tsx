import { ContextMenu, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesTreeStore } from '@renderer/stores'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  title: string
  path: string
  updateAt: string
  onClick: () => void
  fetchMemoList: () => void
}

const MemoItem = ({ title, path, updateAt, onClick, fetchMemoList }: Props) => {
  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()

  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) {
      closeContextMenu()
    }
  })

  const contextMenuData = [
    {
      label: '메모 삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await fileSystemService.delete(path)
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
          fetchMemoList()
        }
      }
    }
  ]

  const handleOpenContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    openContextMenu(e)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (e.button !== 2) {
      onClick()
    }
  }

  return (
    <>
      <StyledMemoItem onClick={handleClick} onContextMenu={handleOpenContextMenu}>
        <Text fontType="T4" color={color.G900} ellipsis>
          {title}
        </Text>
        <MemoItemDateText>{updateAt}</MemoItemDateText>
      </StyledMemoItem>
      {contextMenuVisible && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            zIndex: 9999
          }}
        >
          <ContextMenu data={contextMenuData} />
        </div>
      )}
    </>
  )
}

export default MemoItem

const StyledMemoItem = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
  padding: 14px 0px 14px 12px;
  gap: 2px;

  border-bottom: 1px solid ${color.G30};
  background: ${color.G0};
  cursor: pointer;
`

const MemoItemDateText = styled.div`
  color: ${color.G100};
  font-family: Paperlogy;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0.12px;
`
