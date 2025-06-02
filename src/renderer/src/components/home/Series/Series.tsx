import { Row, IconButton } from '@renderer/components/common'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import SeriesItem from './SeriesListItem/SeriesListItem'
import useOverlay from '@renderer/hooks/useOverlay'
import SeriesCreateModal from './SeriesCreateModal/SeriesCreateModal'

const dummySeriesData = [
  {
    id: '1',
    image: 'dummyImage1.png',
    title: '별종',
    lastUpdated: new Date('2025-05-17 10:20:30')
  },
  { id: '2', image: 'dummyImage2.png', title: '붉은색 배롱나무처럼', lastUpdated: new Date() },
  {
    id: '3',
    image: 'dummyImage3.png',
    title: '괴담에 떨어져도 출근을 해야 하는구나',
    lastUpdated: new Date('2025-05-26 10:20:30')
  },
  {
    id: '4',
    image: 'dummyImage4.png',
    title: '회귀한 천재 닥터의 미국 정복기',
    lastUpdated: new Date('2024-05-17 10:20:30')
  },
  {
    id: '5',
    image: 'dummyImage5.png',
    title: '빙의자에게 미래를 빼았겼다',
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
  const { handleOpen, Overlay } = useOverlay(({ isOpen, onClose }) => (
    <SeriesCreateModal isOpen={isOpen} onClose={onClose} />
  ))

  return (
    <StyledSeries>
      <Row justifyContent="flex-end">
        <IconButton onClick={handleOpen}>새 시리즈</IconButton>
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
      {Overlay}
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
