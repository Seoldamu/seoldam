import { color, font } from '@renderer/design/styles'
import { styled } from 'styled-components'

interface Props {
  message: string
}

const UserMessage = ({ message }: Props) => {
  return (
    <MessageWrapper>
      <StyledUserMessage>{message}</StyledUserMessage>
    </MessageWrapper>
  )
}

export default UserMessage

const MessageWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 4px 10px;
`

const StyledUserMessage = styled.div`
  display: inline-block;
  max-width: 70%;
  background: ${color.primary};
  color: ${color.G0};
  padding: 10px 14px;
  border-radius: 12px;

  ${font.B1};
  word-break: break-word;
  white-space: pre-wrap;
`
