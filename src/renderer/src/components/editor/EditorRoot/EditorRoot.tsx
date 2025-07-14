import {
  ContentPreview,
  EditableText,
  IconButton,
  Row,
  SeriesDropdown
} from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useSeriesStore, useSeriesTreeStore, useSeriesListStore } from '@renderer/stores'
import { TreeNode } from '@renderer/types/series/type'
import { flex, flattenTree } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

const EditorRoot = () => {
  const { currentSeriesPath, currentPath, setCurrentPath, setSeriesPath } = useSeriesStore()
  const { fetchTreeData } = useSeriesTreeStore()
  const [childNodes, setChildNodes] = useState<TreeNode[]>([])
  const { seriesList, fetchSeriesList } = useSeriesListStore()

  const isRoot = currentPath === currentSeriesPath

  useEffect(() => {
    const fetchStructure = async () => {
      if (!currentPath) return

      let result
      if (isRoot) {
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
      setCurrentPath(node.path)
    }
  }

  const handleSeriesChange = (newSeriesPath: string) => {
    setSeriesPath(newSeriesPath)
    setCurrentPath(newSeriesPath)
  }

  const handleNameChange = async (newName: string) => {
    if (!currentPath || !newName) return

    const result = await window.api.renamePath(currentPath, newName)
    if (result.success) {
      if (isRoot) {
        setSeriesPath(result.path)
      }
      setCurrentPath(result.path)
      fetchTreeData()
      fetchSeriesList()
    } else {
      alert(`이름 변경 실패: ${result.message}`)
    }
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
            onChange={handleNameChange}
            color={color.G900}
            value={title}
            width="100%"
          />
          {isRoot ? (
            <SeriesDropdown
              name="series-title"
              value={title}
              data={dropdownData}
              onChange={handleSeriesChange}
            />
          ) : null}
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
