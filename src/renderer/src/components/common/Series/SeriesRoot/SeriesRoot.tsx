import { flex, joinPath } from '@renderer/utils'
import { styled } from 'styled-components'
import { ContextMenu, Text } from '@renderer/components/common'
import { IconAdd, IconDocument } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { useSeriesTreeStore } from '@renderer/stores'

interface Props {
  seriesPath: string
}

const SeriesRoot = ({ seriesPath }: Props) => {
  const seriesName = seriesPath.split(/[/\\]/).pop() || ''

  const seriesRootPath = joinPath(seriesPath, 'root')

  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()

  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) {
      closeContextMenu()
    }
  })

  const contextMenuData = [
    {
      label: '폴더 생성',
      value: 'create-folder',
      onClick: async () => {
        closeContextMenu()
        const result = await window.api.createFolder(seriesRootPath)
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
        }
      }
    },
    {
      label: '파일 생성',
      value: 'create-file',
      onClick: async () => {
        closeContextMenu()
        const result = await window.api.createFile(seriesRootPath)
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
        }
      }
    }
  ]

  return (
    <>
      <StyledSeriesRoot>
        <IconDocument
          width={24}
          height={24}
          onClick={() => {
            /*시리즈 열기 조정 */
          }}
        />
        <Text fontType="B1" color={color.G800} width="calc(100% - 58px)" ellipsis={true}>
          {seriesName}
        </Text>
        <IconAdd width={20} height={20} onClick={openContextMenu} />
      </StyledSeriesRoot>
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

export default SeriesRoot

const StyledSeriesRoot = styled.div`
  ${flex({ alignItems: 'center', justifyContent: 'space-between' })}
  width: 100%;
  gap: 6px;
`
