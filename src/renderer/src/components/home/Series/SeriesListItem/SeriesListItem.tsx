import { Column, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  id: string
  image: string
  title: string
  lastUpdated: Date
}

const SeriesItem = ({ id, image, title, lastUpdated }: Props) => {
  return (
    <StyledSeriesItem>
      <SeriesItemImg src={image} />
      <Column>
        <SereisItemTitle fontType="H1" color={color.G900} ellipsis={true}>
          {title}
        </SereisItemTitle>
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
  object-fit: cover;
`

const SeriesItemImg = styled.img`
  ${flex({ flexDirection: 'column', alignItems: 'center' })}
  width: 100%;
  border-radius: 12px;
`

const SereisItemTitle = styled(Text)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`
