import { styled } from 'styled-components'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { useSeriesTreeStore } from '@renderer/stores'
import { flex } from '@renderer/utils'
import ContextMenu from '../ContextMenu/ContextMenu'
import Text from '../Text/Text'

interface Props {
  title: string
  content: string
  path: string
  onDelete: () => void
}

const ContentPreview = ({ title, content, path, onDelete }: Props) => {
  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()
  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) closeContextMenu()
  })

  const contextMenuData = [
    {
      label: '삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await window.api.deleteSeriesTargetPath(path)
        if (result.success) useSeriesTreeStore.getState().fetchTreeData()
        onDelete()
      }
    }
  ]

  return (
    <>
      <StyledContentPreview
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          openContextMenu(e)
        }}
      >
        <Text fontType="H2" color={color.G900} ellipsis={2} whiteSpace="normal">
          {title}
        </Text>
        <Text fontType="B3" color={color.G100} ellipsis={6} whiteSpace="normal">
          {content}
        </Text>
      </StyledContentPreview>
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

export default ContentPreview

const StyledContentPreview = styled.div`
  ${flex({ alignItems: 'flex-start', flexDirection: 'column' })}
  width: 100%;
  height: 180px;
  padding: 16px 10px;
  gap: 6px;
  border-radius: 8px;
  background: ${color.G20};
`
