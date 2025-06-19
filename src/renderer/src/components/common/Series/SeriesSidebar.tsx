import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import SeriesRoot from './SeriesRoot/SeriesRoot'
import { useEffect, useState } from 'react'
import { TreeNode } from '@renderer/types/series/type'
import SeriesFolder from './SeriesFolder/SeriesFolder'
import SeriesFile from './SeriesFile/SeriesFile'
import { useSeriesStore } from '@renderer/stores/seriesStore'

const SeriesSidebar = () => {
  const currentSeriesPath = useSeriesStore((state) => state.currentSeriesPath)
  const [treeData, setTreeData] = useState<TreeNode[]>([])

  console.log(currentSeriesPath)

  useEffect(() => {
    if (!currentSeriesPath) return

    const fetchTree = async () => {
      const result = await window.api.getSeriesStructure(currentSeriesPath)
      if (result.success) setTreeData(result.structure)
    }

    fetchTree()
  }, [currentSeriesPath])

  if (!currentSeriesPath) return null

  const seriesName = currentSeriesPath.split('\\').pop() || ''

  return (
    <StyledSeriesSidebar>
      <SeriesRoot seriesName={seriesName} />
      <SeriesWorkspace>
        {treeData.map((node, i) =>
          node.type === 'folder' ? (
            <SeriesFolder key={`${node.name}-${i}`} node={node} />
          ) : (
            <SeriesFile key={`${node.name}-${i}`} node={node} />
          )
        )}
      </SeriesWorkspace>
    </StyledSeriesSidebar>
  )
}

export default SeriesSidebar

const StyledSeriesSidebar = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
  margin-top: 50px;
  padding: 0px 20px;
  gap: 11px;
`

const SeriesWorkspace = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'center' })}
  padding: 0 0 23px 30px;
`
