import { IconArticle } from '@renderer/design/icons'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { Row, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { TreeNode } from '@renderer/types/series/type'
import { ContextMenu } from '@renderer/components/common'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { useSeriesStore, useSeriesTreeStore } from '@renderer/stores'
import { useState } from 'react'
import TempObject from '../TempObject/TempObject'

interface Props {
  node: TreeNode
}

const SeriesFile = ({ node }: Props) => {
  const setCurrentPath = useSeriesStore((state) => state.setCurrentPath)

  const [updateType, setUpdateType] = useState<'file' | null>(null)

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
        const result = await window.api.deleteSeriesTargetPath(node.path)
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
        }
      }
    }
  ]

  const handleUpdateSumit = async (name: string) => {
    const result = await window.api.renamePath(node.path, name)
    if (result.success) useSeriesTreeStore.getState().fetchTreeData()
  }

  const handleFileDoubleClick = () => {
    setCurrentPath(node.path)
  }

  return (
    <>
      <StyledSeriesFile onContextMenu={openContextMenu} onDoubleClick={handleFileDoubleClick}>
        {updateType ? (
          <TempObject
            type={updateType}
            onCancel={() => setUpdateType(null)}
            onSubmit={handleUpdateSumit}
          />
        ) : (
          <Row gap={8}>
            <IconArticle width={24} height={24} />
            <Text fontType="B2" color={color.G800} ellipsis={true}>
              {node.name}
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
