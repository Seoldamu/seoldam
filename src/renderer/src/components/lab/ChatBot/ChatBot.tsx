import ChatInput from '@renderer/components/common/Input/ChatInput'
import { color } from '@renderer/design/styles'
import { aiService } from '@renderer/services/aiService'
import { useChatStore } from '@renderer/stores/chatStore'
import useSeriesStore from '@renderer/stores/seriesStore'
import { flex } from '@renderer/utils'
import { useState } from 'react'
import { styled } from 'styled-components'

import AssistantMessage from './ChatMessage/AssistantMessage'
import UserMessage from './ChatMessage/UserMessage'
import { Text } from '@renderer/components/common'

const ChatBot = () => {
  const { messages, addMessage } = useChatStore()
  const { currentSeriesPath } = useSeriesStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (msg: string) => {
    if (!msg.trim() || isLoading) return

    addMessage('user', msg)
    setIsLoading(true)

    try {
      const response = await aiService.askChatbot(msg, currentSeriesPath)
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
          {messages.length === 0 ? (
            <EmptyBox>
              <Text fontType="H1" color={color.G500}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: color.primary }}>설다무</span>에게 궁금한 점을 물어보세요!
                </div>
                <br />
                (예: 이 시리즈의 다음 줄거리를 추천해 줘)
              </Text>
            </EmptyBox>
          ) : (
            messages.map((msg) =>
              msg.role === 'user' ? (
                <UserMessage key={msg.id} message={msg.content} />
              ) : (
                <AssistantMessage key={msg.id} message={msg.content} />
              )
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

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G50};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${color.G100};
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const MessageContainer = styled.div`
  width: 70%;
  padding: 0px 24px;
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

const EmptyBox = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' })}
  width: 100%;
  height: 100%;
`
