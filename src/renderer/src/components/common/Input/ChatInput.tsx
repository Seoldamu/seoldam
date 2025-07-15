import { color, font } from '@renderer/design/styles'
import { useRef } from 'react'
import styled from 'styled-components'
import Column from '../Flex/Column'
import { flex } from '@renderer/utils'

interface ChatInputProps {
  onSend?: (message: string) => void
  isLoading?: boolean
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (isLoading) return
    const text = ref.current?.innerText.trim()
    if (!text) return
    onSend?.(text)
    if (ref.current) ref.current.innerText = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const scrollToCaret = () => {
    const el = ref.current
    if (!el) return

    if (el.textContent === '') {
      el.innerHTML = ''
    }

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const containerRect = el.getBoundingClientRect()

    const offset = rect.bottom - containerRect.bottom
    if (offset > 0) {
      el.scrollTop += offset + 10
    }
  }

  return (
    <InputWrapper
      style={{
        backgroundColor: isLoading ? color.G20 : color.G0
      }}
    >
      <Column>
        <ContentEditable
          contentEditable={!isLoading}
          ref={ref}
          onKeyDown={handleKeyDown}
          onInput={scrollToCaret}
          data-placeholder="메시지를 입력하세요..."
        />
        <ButtonWrapper>
          {/*TODO: 이성, 글쓰기, 등 AI 모드 적용 버튼과 마우스로 handleSend 버튼 추가 */}
        </ButtonWrapper>
      </Column>
    </InputWrapper>
  )
}

export default ChatInput

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-right: 12px;
  background: ${color.G0};
  border: 1px solid ${color.G50};
  border-radius: 15px;

  &:focus-within {
    border-color: ${color.primary};
  }
`

const ContentEditable = styled.div`
  width: 98%;
  ${font.L2}
  max-height: 10em;
  min-height: 42px;
  overflow-y: auto;
  padding: 12px 28px 12px 16px;

  border: none;
  outline: none;
  box-sizing: border-box;
  white-space: pre-wrap;
  word-break: break-word;

  scrollbar-width: thin;
  scrollbar-color: ${color.G50} transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G50};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &:empty:before {
    content: attr(data-placeholder);
    color: ${color.G50};
  }
`

const ButtonWrapper = styled.div`
  ${flex({ flexDirection: 'row', alignItems: 'center' })}
  width: 100%;
  padding: 10px 28px 8px 16px;
`
