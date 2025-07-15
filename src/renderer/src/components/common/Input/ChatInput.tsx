import { color, font } from '@renderer/design/styles'
import { useRef } from 'react'
import styled from 'styled-components'

interface ChatInputProps {
  onSend: (message: string) => void
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    const text = ref.current?.innerText.trim()
    if (!text) return
    onSend(text)
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
    <InputWrapper>
      <ContentEditable
        contentEditable
        ref={ref}
        onKeyDown={handleKeyDown}
        onInput={scrollToCaret}
        data-placeholder="메시지를 입력하세요..."
      />
    </InputWrapper>
  )
}

export default ChatInput

const InputWrapper = styled.div`
  position: relative;
  width: 667px;
  padding-right: 12px;
  background: 1px soild ${color.G0};
  border: 1px solid ${color.G50};
  border-radius: 15px;

  &:focus-within {
    border-color: ${color.primary};
  }
`

const ContentEditable = styled.div`
  width: 100%;
  ${font.L2}
  max-height: 10em;
  min-height: 42px;
  overflow-y: auto;
  padding: 10px 28px 10px 12px;

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
