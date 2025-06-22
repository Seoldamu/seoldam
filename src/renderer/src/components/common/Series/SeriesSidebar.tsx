import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import SeriesRoot from './SeriesRoot/SeriesRoot'
import { useEffect } from 'react'
import SeriesFolder from './SeriesFolder/SeriesFolder'
import SeriesFile from './SeriesFile/SeriesFile'
import { useSeriesStore, useSeriesTreeStore } from '@renderer/stores'

const SeriesSidebar = () => {
  const currentSeriesPath = useSeriesStore((state) => state.currentSeriesPath)
  const treeData = useSeriesTreeStore((state) => state.treeData)
  const fetchTreeData = useSeriesTreeStore((state) => state.fetchTreeData)

  useEffect(() => {
    if (currentSeriesPath) fetchTreeData()
  }, [currentSeriesPath])

  if (!currentSeriesPath) return null

  return (
    <StyledSeriesSidebar>
      <SeriesRoot seriesPath={currentSeriesPath} />
      <SeriesWorkspace>
        <ScrollableContent>
          {treeData.map((node, i) =>
            node.type === 'folder' ? (
              <SeriesFolder key={`${node.name}-${i}`} node={node} />
            ) : (
              <SeriesFile key={`${node.name}-${i}`} node={node} />
            )
          )}
        </ScrollableContent>
      </SeriesWorkspace>
    </StyledSeriesSidebar>
  )
}

export default SeriesSidebar

const StyledSeriesSidebar = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  height: 100%;
  margin-top: 50px;
  padding: 0 20px;
  gap: 6px;
  overflow: hidden;
`

const SeriesWorkspace = styled.div`
  width: 100%;
  flex: 1;
  overflow: auto;
  min-width: 0;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const ScrollableContent = styled.div`
  width: 100%;
  display: inline-block;
  min-width: max-content;
  padding: 0 0 23px 30px;
`
