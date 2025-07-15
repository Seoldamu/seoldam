import { ContextMenu, Row, Text } from '@renderer/components/common'
import { IconFolder } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore } from '@renderer/stores'
import { TreeNode } from '@renderer/types/series/type'
import { flex } from '@renderer/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

import SeriesFile from '../SeriesFile/SeriesFile'
import TempObject from '../TempObject/TempObject'

interface Props {
  node: TreeNode
}

const SeriesFolder = ({ node }: Props) => {
  const setCurrentPath = useSeriesStore((state) => state.setCurrentPath)

  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false)
  const [creatingType, setCreatingType] = useState<'file' | 'folder' | null>(null)
  const [updateType, setUpdateType] = useState<'folder' | null>(null)

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
      label: '이름 변경',
      value: 'rename',
      onClick: async () => {
        closeContextMenu()
        setUpdateType('folder')
      }
    },
    {
      label: '폴더 삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await fileSystemService.delete(node.path)
        if (result.success) useSeriesTreeStore.getState().fetchTreeData()
      }
    }
  ]

  const handleCreateSubmit = async (name: string) => {
    const result =
      creatingType === 'folder'
        ? await fileSystemService.createFolder(node.path, name)
        : await fileSystemService.createFile(node.path, name)

    if (result.success) useSeriesTreeStore.getState().fetchTreeData()
    setCreatingType(null)
  }

  const handleUpdateSumit = async (name: string) => {
    const result = await fileSystemService.rename(node.path, name)
    if (result.success) useSeriesTreeStore.getState().fetchTreeData()
  }

  const handleFolderDoubleClick = () => {
    setIsOpen(true)
    setCurrentPath(node.path)
    navigate('/editor')
  }

  return (
    <>
      <StyledSeriesFolder
        onContextMenu={handleOpenContextMenu}
        onClick={() => setIsOpen(!isOpen)}
        onDoubleClick={handleFolderDoubleClick}
      >
        {updateType ? (
          <TempObject
            type={updateType}
            initialName={node.name}
            onCancel={() => setUpdateType(null)}
            onSubmit={handleUpdateSumit}
          />
        ) : (
          <Row gap={8}>
            <IconFolder width={24} height={24} active={isOpen} />
            <Text fontType="B2" color={color.G800} ellipsis>
              {node.name}
            </Text>
          </Row>
        )}
      </StyledSeriesFolder>

      <FolderContent>
        {isOpen && creatingType && (
          <TempObject
            type={creatingType}
            onCancel={() => setCreatingType(null)}
            onSubmit={handleCreateSubmit}
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
