import {
  ContentPreview,
  EditableText,
  IconButton,
  Row,
  SeriesDropdown
} from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useToast } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { seriesService } from '@renderer/services/seriesService'
import { useSeriesStore, useSeriesTreeStore, useSeriesListStore } from '@renderer/stores'
import { TreeNode } from '@renderer/types/series/type'
import { flex, flattenTree, joinPath } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

const FolderEditor = () => {
  const { currentSeriesPath, currentPath, setCurrentPath, setSeriesPath } = useSeriesStore()
  const { fetchTreeData } = useSeriesTreeStore()
  const { seriesList, fetchSeriesList } = useSeriesListStore()

  const [childNodes, setChildNodes] = useState<TreeNode[]>([])

  const toast = useToast()

  const isRoot = currentPath === currentSeriesPath

  const fetchStructure = async () => {
    if (!currentPath) return

    let result
    if (isRoot) {
      result = await seriesService.getRootDirectory(currentPath)
    } else {
      result = await fileSystemService.getDirectory(currentPath)
    }

    if (result && result.success) {
      const nodes = flattenTree(result.structure).filter((node) => node.type === 'file')
      setChildNodes(nodes)
    } else {
      console.error('Failed to fetch series structure:', result?.message)
      setChildNodes([])
    }
  }

  useEffect(() => {
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

    const result = await fileSystemService.rename(currentPath, newName)
    if (result.success) {
      toast('SUCCESS', `이름 변경에 성공하였습니다`)
      if (isRoot) {
        setSeriesPath(result.path)
      }
      setCurrentPath(result.path)
      fetchTreeData()
      fetchSeriesList()
    } else {
      toast('ERROR', `이름 변경 실패: ${result.message}`)
    }
  }

  const dropdownData = seriesList.map((series) => ({
    image: series.coverImagePath,
    value: series.path,
    label: series.title
  }))

  const handleNewFileCreateButton = async () => {
    if (!currentPath) return

    const result = isRoot
      ? await fileSystemService.createFile(joinPath(currentPath, 'root'), '새 파일.md')
      : await fileSystemService.createFile(currentPath, '새 파일.md')

    if (result.success) {
      useSeriesTreeStore.getState().fetchTreeData()
      fetchStructure()
    }
  }

  return (
    <StyledFolderEditor>
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
        <IconButton onClick={handleNewFileCreateButton}>새 글</IconButton>
      </Row>
      <ScrollArea>
        <FileList>
          {childNodes.map((node) => (
            <div key={node.id} onClick={() => handleNodeClick(node)}>
              <ContentPreview title={node.name} content={node.content || ''} />
            </div>
          ))}
        </FileList>
      </ScrollArea>
    </StyledFolderEditor>
  )
}

export default FolderEditor

const StyledFolderEditor = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  height: 100vh;
  padding: 68px 205px 0px 72px;
  gap: 38px;
  background: ${color.G0};
`

const ScrollArea = styled.div`
  flex-grow: 1 0 0;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G40};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${color.G80};
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
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
