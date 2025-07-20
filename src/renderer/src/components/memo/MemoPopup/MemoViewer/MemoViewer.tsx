import { Row } from '@renderer/components/common'
import { IconLongArrow } from '@renderer/design/icons'
import { color, font } from '@renderer/design/styles'
import { useFileContent } from '@renderer/hooks'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  currentMemoPath: string
  setCurrentMemoPath: (path: string | null) => void
}

const MemoViewer = ({ currentMemoPath, setCurrentMemoPath }: Props) => {
  const { fileName, initialContent: content } = useFileContent(currentMemoPath)

  const handleBackButtonClick = () => {
    setCurrentMemoPath(null)
  }

  return (
    <StyledMemoViewer>
      <Row gap={6}>
        <IconLongArrow onClick={handleBackButtonClick} style={{ cursor: 'pointer' }} />
        <MemoViewerTitleText>{fileName}</MemoViewerTitleText>
      </Row>
      <ScrollArea>
        <MemoViewerContentText dangerouslySetInnerHTML={{ __html: content }} />
      </ScrollArea>
    </StyledMemoViewer>
  )
}

export default MemoViewer

const StyledMemoViewer = styled.div`
  ${flex({ flexDirection: 'column' })}
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

const MemoViewerContentText = styled.div`
  display: inline-block;
  max-width: 100%;
  background: ${color.G0};
  color: ${color.G800};

  ${font.B1};
  word-break: break-word;
  white-space: pre-wrap;

  h1,
  h2,
  h3 {
    font-weight: bold;
    margin: 8px 0 4px;
  }

  p {
    margin: 4px 0;
  }

  ul,
  ol {
    margin: 6px 0;
    padding-left: 20px;
  }

  blockquote {
    margin: 8px 0;
    padding-left: 12px;
    border-left: 3px solid ${color.G200};
    color: ${color.G600};
  }

  code {
    background: ${color.G100};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
  }

  pre {
    background: ${color.G100};
    padding: 10px;
    border-radius: 6px;
    overflow-x: auto;
  }

  a {
    color: ${color.primary};
    text-decoration: underline;
  }
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
