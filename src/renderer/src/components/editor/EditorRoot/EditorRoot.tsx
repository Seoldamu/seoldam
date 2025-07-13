import {
  ContentPreview,
  EditableText,
  IconButton,
  Row,
  SeriesDropdown
} from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useSeriesStore } from '@renderer/stores'
import { TreeNode } from '@renderer/types/series/type'
import { flex, flattenTree } from '@renderer/utils'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'

const EditorRoot = () => {
  const { currentSeriesPath, currentPath, setCurrentPath } = useSeriesStore()
  const [childNodes, setChildNodes] = useState<TreeNode[]>([])

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

  const title = currentPath?.split(/[/\\]/).pop() || ''

  const handleNodeClick = (node: TreeNode) => {
    if (node.type === 'folder') {
      setCurrentPath(node.path)
    } else {
      // TODO: 파일 클릭 시 에디터 뷰로 전환하는 로직 필요
      console.log('File clicked:', node.name)
    }
  }

  return (
    <StyledEditorRoot>
      <Row justifyContent="space-between">
        <Row gap={4}>
          <EditableText
            fontType="T2"
            onChange={() => {}}
            color={color.G900}
            value={title}
            maxWidth={300}
          />
          <SeriesDropdown
            name="series-title"
            value={title}
            data={[{ image: 'dummyImage1.png', value: '별종' }]}
            onChange={() => {}}
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
  ${flex({ alignItems: 'flex-start' })}
  width: 100%;
  align-content: flex-start;
  gap: 20px;
  flex-shrink: 0;
  align-self: stretch;
  flex-wrap: wrap;

  > div {
    cursor: pointer;
  }
`
