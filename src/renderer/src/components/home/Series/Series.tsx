import { IconButton, Row } from '@renderer/components/common'
import useOverlay from '@renderer/hooks/useOverlay'
import { seriesService } from '@renderer/services/seriesService'
import { useSeriesListStore } from '@renderer/stores'
import { SeriesListItem, SeriesMeta } from '@renderer/types/series/type'
import { flex } from '@renderer/utils'
import { useEffect } from 'react'
import { styled } from 'styled-components'

import SeriesCreateModal from './SeriesCreateModal/SeriesCreateModal'
import SeriesItem from './SeriesListItem/SeriesListItem'

const extractSeriesList = (list: SeriesMeta[]): SeriesListItem[] => {
  return list.map(({ id, title, coverImagePath, updatedAt, path }) => ({
    id,
    title,
    coverImagePath,
    updatedAt,
    path
  }))
}

const Series = () => {
  const { seriesList, setSeriesList } = useSeriesListStore()

  const refreshSeriesList = () => {
    seriesService.getList().then((data: SeriesMeta[]) => {
      setSeriesList(extractSeriesList(data))
    })
  }

  const { handleOpen, Overlay } = useOverlay(({ isOpen, onClose }) => (
    <SeriesCreateModal isOpen={isOpen} onClose={onClose} refreshSeriesList={refreshSeriesList} />
  ))

  useEffect(() => {
    seriesService.getList().then((data: SeriesMeta[]) => {
      setSeriesList(extractSeriesList(data))
    })
  }, [])

  return (
    <StyledSeries>
      <Row justifyContent="flex-end">
        <IconButton onClick={handleOpen}>새 시리즈</IconButton>
      </Row>
      <SeriesList>
        {seriesList.map((item) => (
          <SeriesItem
            key={item.id}
            id={item.id}
            title={item.title}
            coverImagePath={item.coverImagePath}
            updatedAt={item.updatedAt}
            path={item.path}
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
