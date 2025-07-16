import { color, font } from '@renderer/design/styles'
import styled from 'styled-components'
import { marked } from 'marked'

interface Props {
  message: string
}

const AssistantMessage = ({ message }: Props) => {
  const html = marked.parse(message)

  return (
    <MessageWrapper>
      <StyledAssistantMessage dangerouslySetInnerHTML={{ __html: html }} />
    </MessageWrapper>
  )
}

export default AssistantMessage

const MessageWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 4px 0;
`

const StyledAssistantMessage = styled.div`
  display: inline-block;
  max-width: 100%;
  background: ${color.G0};
  color: ${color.G800};
  padding: 10px 14px;
  border-radius: 12px;

  ${font.B1};
  word-break: break-word;

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
