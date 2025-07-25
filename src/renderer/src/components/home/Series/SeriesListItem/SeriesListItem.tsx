import { Column, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useSeriesStore } from '@renderer/stores'
import { flex, getRelativeDateString } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  id: string
  title: string
  coverImagePath: string
  updatedAt: string
  path: string
}

const SeriesItem = ({ title, coverImagePath, updatedAt, path }: Props) => {
  const setSeriesPath = useSeriesStore((state) => state.setSeriesPath)
  const setCurrentPath = useSeriesStore((state) => state.setCurrentPath)

  const handleSeriesItemClick = () => {
    setSeriesPath(path)
    setCurrentPath(path)
  }

  return (
    <StyledSeriesItem onClick={handleSeriesItemClick}>
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
