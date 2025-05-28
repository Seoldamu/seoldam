import { Column, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex, getRelativeDateString } from '@renderer/utils'
import { styled } from 'styled-components'
import { useNavigate } from 'react-router-dom'

interface Props {
  id: string
  image: string
  title: string
  lastUpdated: Date
}

const SeriesItem = ({ id, image, title, lastUpdated }: Props) => {
  const navigate = useNavigate()

  const handleSeriesItemClick = () => {
    navigate(`/editor/${id}`)
  }

  return (
    <StyledSeriesItem onClick={handleSeriesItemClick}>
      <SeriesItemImg src={image} />
      <Column gap={4}>
        <Text fontType="H1" color={color.G900} ellipsis={2} whiteSpace="normal">
          {title}
        </Text>
        <Text fontType="L4" color={color.G100} ellipsis={true}>
          {`최근 수정일 ${getRelativeDateString(lastUpdated)}전`}
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
  object-fit: cover;
`

const SeriesItemImg = styled.img`
  ${flex({ flexDirection: 'column', alignItems: 'center' })}
  width: 100%;
  border-radius: 12px;
`
