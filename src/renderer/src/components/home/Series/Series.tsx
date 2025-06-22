import { Row, IconButton } from '@renderer/components/common'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import SeriesItem from './SeriesListItem/SeriesListItem'
import useOverlay from '@renderer/hooks/useOverlay'
import SeriesCreateModal from './SeriesCreateModal/SeriesCreateModal'
import { useEffect, useState } from 'react'
import { SeriesListItem, SeriesMeta } from '@renderer/types/series/type'

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
  const [series, setSeries] = useState<SeriesListItem[]>([])

  const refreshSeriesList = () => {
    window.api.getSeriesList().then((data: SeriesMeta[]) => {
      setSeries(extractSeriesList(data))
    })
  }

  const { handleOpen, Overlay } = useOverlay(({ isOpen, onClose }) => (
    <SeriesCreateModal isOpen={isOpen} onClose={onClose} refreshSeriesList={refreshSeriesList} />
  ))

  useEffect(() => {
    window.api.getSeriesList().then((data: SeriesMeta[]) => {
      setSeries(extractSeriesList(data))
    })
  }, [])

  return (
    <StyledSeries>
      <Row justifyContent="flex-end">
        <IconButton onClick={handleOpen}>새 시리즈</IconButton>
      </Row>
      <SeriesList>
        {series.map((item) => (
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
