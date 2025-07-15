import { color, font } from '@renderer/design/styles'
import styled from 'styled-components'

interface Props {
  message: string
}

const AssistantMessage = ({ message }: Props) => {
  return (
    <MessageWrapper>
      <StyledAssistantMessage>{message}</StyledAssistantMessage>
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
  white-space: pre-wrap;
`
