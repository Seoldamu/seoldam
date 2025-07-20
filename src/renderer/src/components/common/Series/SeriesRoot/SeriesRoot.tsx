import { ContextMenu, Text } from '@renderer/components/common'
import { IconAdd, IconDocument } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesTreeStore, useSeriesStore } from '@renderer/stores'
import { flex, joinPath } from '@renderer/utils'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

interface Props {
  seriesPath: string
}

const SeriesRoot = ({ seriesPath }: Props) => {
  const setCurrentPath = useSeriesStore((state) => state.setCurrentPath)

  const navigate = useNavigate()

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
        const result = await fileSystemService.createFolder(seriesRootPath, '새 폴더')
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
        const result = await fileSystemService.createFile(seriesRootPath, '새 파일')
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
        }
      }
    }
  ]

  const handleSeriesRootClick = () => {
    setCurrentPath(seriesPath)
    navigate('/editor')
  }

  return (
    <>
      <StyledSeriesRoot>
        <NavigateBox onClick={handleSeriesRootClick}>
          <IconDocument width={24} height={24} />
          <Text fontType="B1" color={color.G800} width="100%" ellipsis={true}>
            {seriesName}
          </Text>
        </NavigateBox>
        <IconAdd style={{ cursor: 'pointer' }} width={20} height={20} onClick={openContextMenu} />
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
`

const NavigateBox = styled.div`
  ${flex({ alignItems: 'center' })}
  width: 80%;
  gap: 6px;

  cursor: pointer;
`
