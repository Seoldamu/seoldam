import { ContextMenu, Row, Text } from '@renderer/components/common'
import { IconArticle } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore } from '@renderer/stores'
import { TreeNode } from '@renderer/types/series/type'
import { flex, getDisplayFilePath, getRealFilePath } from '@renderer/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

import TempObject from '../TempObject/TempObject'

interface Props {
  node: TreeNode
}

const SeriesFile = ({ node }: Props) => {
  const [updateType, setUpdateType] = useState<'file' | null>(null)

  const setCurrentPath = useSeriesStore((state) => state.setCurrentPath)
  const fetchTreeData = useSeriesTreeStore((state) => state.fetchTreeData)

  const navigate = useNavigate()
  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()
  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) {
      closeContextMenu()
    }
  })

  const contextMenuData = [
    {
      label: '이름 변경',
      value: 'rename',
      onClick: async () => {
        closeContextMenu()
        setUpdateType('file')
      }
    },
    {
      label: '파일 삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await fileSystemService.delete(node.path)
        if (result.success) {
          fetchTreeData()
        }
      }
    }
  ]

  const handleUpdateSumit = async (name: string) => {
    const result = await fileSystemService.rename(node.path, getRealFilePath(name))
    if (result.success) {
      fetchTreeData()
      setUpdateType(null)
    }
  }

  const handleFileDoubleClick = () => {
    setCurrentPath(node.path)
    navigate('/editor')
  }

  return (
    <>
      <StyledSeriesFile onContextMenu={openContextMenu} onDoubleClick={handleFileDoubleClick}>
        {updateType ? (
          <TempObject
            type={updateType}
            initialName={getDisplayFilePath(node.name)}
            onCancel={() => setUpdateType(null)}
            onSubmit={handleUpdateSumit}
          />
        ) : (
          <Row gap={8}>
            <IconArticle width={24} height={24} />
            <Text fontType="B2" color={color.G800} ellipsis={true}>
              {getDisplayFilePath(node.name)}
            </Text>
          </Row>
        )}
      </StyledSeriesFile>
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

export default SeriesFile

const StyledSeriesFile = styled.div`
  ${flex({ alignItems: 'center' })}
  width: 100%;
  padding: 4px;
  gap: 8px;
  cursor: pointer;

  border-radius: 4px;

  &:hover {
    background: ${color.G20};
  }
`
