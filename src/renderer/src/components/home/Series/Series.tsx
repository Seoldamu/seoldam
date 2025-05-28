import { Row } from '@renderer/components/common'
import { IconButton } from '@renderer/design/ui'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import SeriesItem from './SeriesListItem/SeriesListItem'

const dummySeriesData = [
  {
    id: '1',
    image: 'dummyImage1.png',
    title: '난동꾼',
    lastUpdated: new Date('2025-05-17 10:20:30')
  },
  { id: '2', image: 'dummyImage2.png', title: '엑시오스', lastUpdated: new Date() },
  {
    id: '3',
    image: 'dummyImage3.png',
    title: '흐름',
    lastUpdated: new Date('2025-05-26 10:20:30')
  },
  {
    id: '4',
    image: 'dummyImage4.png',
    title: '유수',
    lastUpdated: new Date('2024-05-17 10:20:30')
  },
  {
    id: '5',
    image: 'dummyImage1.png',
    title: '시리즈 5',
    lastUpdated: new Date('2025-05-18 09:10:00')
  },
  {
    id: '6',
    image: 'dummyImage2.png',
    title: '시리즈 6',
    lastUpdated: new Date('2025-05-19 11:15:20')
  },
  {
    id: '7',
    image: 'dummyImage3.png',
    title: '시리즈 7',
    lastUpdated: new Date('2025-05-20 14:25:30')
  },
  {
    id: '8',
    image: 'dummyImage4.png',
    title: '시리즈 8',
    lastUpdated: new Date('2025-05-21 16:45:10')
  },
  {
    id: '9',
    image: 'dummyImage1.png',
    title: '시리즈 9',
    lastUpdated: new Date('2025-05-22 18:20:00')
  },
  {
    id: '10',
    image: 'dummyImage2.png',
    title: '시리즈 10',
    lastUpdated: new Date('2025-05-23 20:00:00')
  },
  {
    id: '11',
    image: 'dummyImage3.png',
    title: '시리즈 11',
    lastUpdated: new Date('2025-05-24 21:30:00')
  }
]

const Series = () => {
  const handleAddSeriesButtonClick = () => {
    console.log('새 시리즈 생성 버튼이 클릭 되었어요!')
  }

  return (
    <StyledSeries>
      <Row justifyContent="flex-end">
        <IconButton onClick={handleAddSeriesButtonClick}>새 시리즈</IconButton>
      </Row>
      <SeriesList>
        {dummySeriesData.map((item) => (
          <SeriesItem
            key={item.id}
            id={item.id}
            image={item.image}
            title={item.title}
            lastUpdated={item.lastUpdated}
          />
        ))}
      </SeriesList>
    </StyledSeries>
  )
}

export default Series

const StyledSeries = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  gap: 24px;
`

const SeriesList = styled.div`
  ${flex({ alignItems: 'flex-start' })}
  width: 100%;
  align-content: flex-start;
  flex-wrap: wrap;
  gap: 32px 5px;
  overflow-x: hidden;
`
