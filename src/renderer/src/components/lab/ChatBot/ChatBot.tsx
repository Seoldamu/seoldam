import ChatInput from '@renderer/components/common/Input/ChatInput'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import UserMessage from './ChatMessage/UserMessage'
import AssistantMessage from './ChatMessage/AssistantMessage'
import { useChatStore } from '@renderer/stores/chatStore'
import { useState } from 'react'

const ChatBot = () => {
  const { messages, addMessage } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (msg: string) => {
    if (!msg.trim()) return
    if (!msg.trim() || isLoading) return

    addMessage('user', msg)
    setIsLoading(true)

    try {
      const response = await window.api.askChatbot(msg)
      addMessage('assistant', response)
    } catch (error) {
      console.error('Error asking chatbot:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      addMessage('assistant', `오류가 발생했습니다: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <StyledChatBot>
      <ScrollArea>
        <MessageContainer>
          {messages.map((msg) =>
            msg.role === 'user' ? (
              <UserMessage key={msg.id} message={msg.content} />
            ) : (
              <AssistantMessage key={msg.id} message={msg.content} />
            )
          )}
          {isLoading && <AssistantMessage message="생각 중..." />}
        </MessageContainer>
      </ScrollArea>

      <StickyInputWrapper>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
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
  width: 70%;
  bottom: 10px;
  background: ${color.G0};
  padding: 12px 0 16px 0;
  z-index: 10;
`
