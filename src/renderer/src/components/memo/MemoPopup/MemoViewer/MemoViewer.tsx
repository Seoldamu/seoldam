import { EditorContent } from '@tiptap/react'
import { Row } from '@renderer/components/common'
import { IconLongArrow } from '@renderer/design/icons'
import { color, font } from '@renderer/design/styles'
import { useFileContent, useTiptapEditor } from '@renderer/hooks'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  currentMemoPath: string
  setCurrentMemoPath: (path: string | null) => void
}

const MemoViewer = ({ currentMemoPath, setCurrentMemoPath }: Props) => {
  const { fileName, initialContent: content } = useFileContent(currentMemoPath)
  const { editor } = useTiptapEditor({
    initialContent: content,
    editable: false
  })

  const handleBackButtonClick = () => {
    setCurrentMemoPath(null)
  }

  if (!editor) {
    return null
  }

  return (
    <StyledMemoViewer>
      <Row gap={6} alignItems="center">
        <IconLongArrow onClick={handleBackButtonClick} style={{ cursor: 'pointer' }} />
        <MemoViewerTitleText>{fileName}</MemoViewerTitleText>
      </Row>
      <ScrollArea>
        <FileContent>
          <EditorContent editor={editor} />
        </FileContent>
      </ScrollArea>
    </StyledMemoViewer>
  )
}

export default MemoViewer

const StyledMemoViewer = styled.div`
  ${flex({ flexDirection: 'column' })}
  height: 100%;
`

const MemoViewerTitleText = styled.div`
  color: ${color.G900};
  font-family: Paperlogy;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%;
  letter-spacing: -0.16px;
`

const FileContent = styled.div`
  height: 100%;

  .ProseMirror {
    ${font.B1}
    color: ${color.G500};
    width: 100%;
    height: 100%;
    min-height: 200px;
    outline: none;

    display: block;

    & > * {
      display: block;
    }

    &:focus {
      outline: none;
    }

    p {
      margin-block-start: 1em;
      margin-block-end: 1em;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${color.G80};
      pointer-events: none;
      height: 0;
    }
  }
`

const ScrollArea = styled.div`
  flex-grow: 1 0 0;
  overflow-y: auto;
  display: flex;
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
