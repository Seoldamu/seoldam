import { Column, ContextMenu, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useContextMenu, useOutsideClick, useToast } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore } from '@renderer/stores'
import { flex, getRelativeDateString } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  id: string
  title: string
  coverImagePath: string
  updatedAt: string
  path: string
  fetchSeriesList: () => void
}

const SeriesItem = ({ title, coverImagePath, updatedAt, path, fetchSeriesList }: Props) => {
  const { currentSeriesPath, setSeriesPath, setCurrentPath } = useSeriesStore()

  const toast = useToast()

  const { contextMenuVisible, contextMenuPosition, openContextMenu, closeContextMenu } =
    useContextMenu()

  const contextMenuRef = useOutsideClick<HTMLDivElement>(() => {
    if (contextMenuVisible) {
      closeContextMenu()
    }
  })

  const contextMenuData = [
    {
      label: '시리즈 삭제',
      value: 'delete',
      onClick: async () => {
        closeContextMenu()
        const result = await fileSystemService.delete(path)
        if (result.success) {
          useSeriesTreeStore.getState().fetchTreeData()
          if (path === currentSeriesPath) {
            setSeriesPath(null)
            setCurrentPath(null)
          }
          toast('SUCCESS', `${title} 시리즈가 삭제되었습니다`)
          fetchSeriesList()
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

  const handleSeriesItemClick = () => {
    setSeriesPath(path)
    setCurrentPath(path)
  }

  return (
    <>
      <StyledSeriesItem onClick={handleSeriesItemClick} onContextMenu={handleOpenContextMenu}>
        <SeriesItemImgWrapper>
          <SeriesItemImg src={coverImagePath} />
        </SeriesItemImgWrapper>
        <Column gap={4}>
          <Text fontType="H1" color={color.G900} ellipsis={2} whiteSpace="normal">
            {title}
          </Text>
          <Text fontType="L4" color={color.G100} ellipsis={true}>
            {`최근 수정일 ${getRelativeDateString(updatedAt)}전`}
          </Text>
        </Column>
      </StyledSeriesItem>
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

export default SeriesItem

const StyledSeriesItem = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: calc(16.748436% - 5px);
  min-width: 0;
  gap: 12px;
  cursor: pointer;
`

const SeriesItemImgWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 12px;
  overflow: hidden;
`

const SeriesItemImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`
