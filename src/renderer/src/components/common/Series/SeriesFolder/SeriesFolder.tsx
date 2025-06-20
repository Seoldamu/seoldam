import { IconFolder } from '@renderer/design/icons'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import SeriesFile from '../SeriesFile/SeriesFile'
import { useState } from 'react'
import { TreeNode } from '@renderer/types/series/type'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import ContextMenu from '../../ContextMenu/ContextMenu'
import { useSeriesTreeStore } from '@renderer/stores'

interface Props {
  node: TreeNode
}

const SeriesFolder = ({ node }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()

  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) {
      closeContextMenu()
    }
  })

  const contextMenuData = [
    {
      label: '폴더 이름 변경',
      value: 'rename',
      onClick: () => {
        closeContextMenu()
        console.log(`Rename ${node.name}`)
      }
    },
    {
      label: '폴더 삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await window.api.deleteSeriesTargetPath(node.path)
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
        }
      }
    }
  ]

  return (
    <>
      <StyledSeriesFolder onContextMenu={openContextMenu} onClick={() => setIsOpen(!isOpen)}>
        <IconFolder width={24} height={24} active={isOpen} />
        <Text fontType="B2" color={color.G800} ellipsis={true}>
          {node.name}
        </Text>
      </StyledSeriesFolder>
      <FolderContent>
        {isOpen &&
          node.children?.map((child, i) =>
            child.type === 'folder' ? (
              <SeriesFolder key={`${node.name}-${i}`} node={child} />
            ) : (
              <SeriesFile key={`${node.name}-${i}`} node={child} />
            )
          )}
      </FolderContent>
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

export default SeriesFolder

const StyledSeriesFolder = styled.div`
  ${flex({ alignItems: 'flex-start' })}
  width: 100%;
  padding: 4px;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: ${color.G20};
  }
`

const FolderContent = styled.div`
  ${flex({ flexDirection: 'column' })}
  margin-left: 10px;
`
