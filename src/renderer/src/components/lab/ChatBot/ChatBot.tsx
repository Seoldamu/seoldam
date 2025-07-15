import ChatInput from '@renderer/components/common/Input/ChatInput'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import UserMessage from './ChatMessage/UserMessage'
import AssistantMessage from './ChatMessage/AssistantMessage'

const ChatBot = () => {
  return (
    <StyledChatBot>
      <ScrollArea>
        <MessageContainer>
          <UserMessage message="안녕하세요!" />
          <AssistantMessage message="무엇을 도와드릴까요?\n여러 줄도 가능합니다." />
          <UserMessage message="또 질문 있습니다." />
          <AssistantMessage message="언제든지 물어보세요!" />
          {/* ... */}
        </MessageContainer>
      </ScrollArea>

      <StickyInputWrapper>
        <ChatInput onSend={(msg) => console.log(msg)} />
      </StickyInputWrapper>
    </StyledChatBot>
  )
}

export default ChatBot

const StyledChatBot = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  height: 100%;
  padding: 0 0 0 156px;
  background: ${color.G0};
  position: relative;
`

const ScrollArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  padding: 40px 24px 20px 0;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G30};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

const MessageContainer = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const StickyInputWrapper = styled.div`
  position: sticky;
  bottom: 0;
  background: ${color.G0};
  padding: 12px 0 16px 0;
  z-index: 10;

  & > * {
    width: 70%;
  }
`
