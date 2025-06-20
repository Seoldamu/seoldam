import { IconFolder } from '@renderer/design/icons'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { Text, ContextMenu } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import SeriesFile from '../SeriesFile/SeriesFile'
import { useState } from 'react'
import { TreeNode } from '@renderer/types/series/type'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { useSeriesTreeStore } from '@renderer/stores'
import TempObject from '../TempObject/TempObject'

interface Props {
  node: TreeNode
}

const SeriesFolder = ({ node }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null)

  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()
  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) closeContextMenu()
  })

  const handleOpenContextMenu = (e: React.MouseEvent<Element, MouseEvent>) => {
    setIsOpen(true)
    openContextMenu(e)
  }

  const contextMenuData = [
    {
      label: '폴더 생성',
      value: 'create-folder',
      onClick: () => {
        closeContextMenu()
        setCreatingType('folder')
      }
    },
    {
      label: '파일 생성',
      value: 'create-file',
      onClick: () => {
        closeContextMenu()
        setCreatingType('file')
      }
    },
    {
      label: '폴더 삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await window.api.deleteSeriesTargetPath(node.path)
        if (result.success) useSeriesTreeStore.getState().fetchTreeData()
      }
    }
  ]

  const handleSubmit = async (name: string) => {
    const result =
      creatingType === 'folder'
        ? await window.api.createFolder(node.path, name)
        : await window.api.createFile(node.path, name)

    if (result.success) useSeriesTreeStore.getState().fetchTreeData()
    setCreatingType(null)
  }

  return (
    <>
      <StyledSeriesFolder onContextMenu={handleOpenContextMenu} onClick={() => setIsOpen(!isOpen)}>
        <IconFolder width={24} height={24} active={isOpen} />
        <Text fontType="B2" color={color.G800} ellipsis>
          {node.name}
        </Text>
      </StyledSeriesFolder>

      <FolderContent>
        {isOpen && creatingType && (
          <TempObject
            type={creatingType}
            onCancel={() => setCreatingType(null)}
            onSubmit={handleSubmit}
          />
        )}
        {isOpen &&
          node.children?.map((child, i) =>
            child.type === 'folder' ? (
              <SeriesFolder key={`${child.name}-${i}`} node={child} />
            ) : (
              <SeriesFile key={`${child.name}-${i}`} node={child} />
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
