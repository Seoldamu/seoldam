import {
  ContentPreview,
  EditableText,
  IconButton,
  Row,
  SeriesDropdown
} from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useSeriesStore } from '@renderer/stores'
import { SeriesListItem, TreeNode } from '@renderer/types/series/type'
import { flex, flattenTree } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

const EditorRoot = () => {
  const { currentSeriesPath, currentPath, setCurrentPath, setSeriesPath } = useSeriesStore()
  const [childNodes, setChildNodes] = useState<TreeNode[]>([])
  const [seriesList, setSeriesList] = useState<SeriesListItem[]>([])

  useEffect(() => {
    const fetchSeriesList = async () => {
      const list = await window.api.getSeriesList()
      setSeriesList(list)
    }
    fetchSeriesList()
  }, [])

  useEffect(() => {
    const fetchStructure = async () => {
      if (!currentPath) return

      let result
      if (currentPath === currentSeriesPath) {
        result = await window.api.getSeriesRootDirectory(currentPath)
      } else {
        result = await window.api.getPathDirectory(currentPath)
      }

      if (result && result.success) {
        const nodes = flattenTree(result.structure).filter((node) => node.type === 'file')
        setChildNodes(nodes)
      } else {
        console.error('Failed to fetch series structure:', result?.message)
        setChildNodes([])
      }
    }
    fetchStructure()
  }, [currentPath, currentSeriesPath])

  const title = currentPath?.split(/[\\/]/).pop() || ''

  const handleNodeClick = (node: TreeNode) => {
    if (node.type === 'folder') {
      setCurrentPath(node.path)
    } else {
      console.log('File clicked:', node.name)
    }
  }

  const handleSeriesChange = (newSeriesPath: string) => {
    setSeriesPath(newSeriesPath)
    setCurrentPath(newSeriesPath)
  }

  const dropdownData = seriesList.map((series) => ({
    image: series.coverImagePath,
    value: series.path,
    label: series.title
  }))

  return (
    <StyledEditorRoot>
      <Row justifyContent="space-between">
        <Row width="60%" gap={4}>
          <EditableText
            fontType="T2"
            onChange={() => {}}
            color={color.G900}
            value={title}
            width="100%"
          />
          <SeriesDropdown
            name="series-title"
            value={title}
            data={dropdownData}
            onChange={handleSeriesChange}
          />
        </Row>
        <IconButton
          onClick={() => {
            console.log('새 글 추가 버튼을 눌렀습니다.')
          }}
        >
          새 글
        </IconButton>
      </Row>
      <FileList>
        {childNodes.map((node) => (
          <div key={node.id} onClick={() => handleNodeClick(node)}>
            <ContentPreview title={node.name} content={node.content || ''} />
          </div>
        ))}
      </FileList>
    </StyledEditorRoot>
  )
}

export default EditorRoot

const StyledEditorRoot = styled.div`
  ${flex({ justifyContent: 'center', flexDirection: 'column' })}
  width: 100%;
  padding: 68px 205px 0px 72px;
  gap: 38px;
  background: ${color.G0};
`

const FileList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px 10px;
  width: 100%;

  > div {
    cursor: pointer;
  }
`
