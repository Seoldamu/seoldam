import { TextArea } from '@renderer/components/common'
import { IconArticle, IconFolder } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useOutsideClick } from '@renderer/hooks'
import { flex } from '@renderer/utils'
import { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

interface Props {
  type: 'folder' | 'file'
  initialName?: string
  onCancel: () => void
  onSubmit: (name: string) => void
}

const TempObject = ({ type, initialName = '', onCancel, onSubmit }: Props) => {
  const [name, setName] = useState(initialName)

  const containerRef = useOutsideClick<HTMLDivElement>(onCancel)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, inputRef.current.value.length)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && name.trim()) {
        e.preventDefault()
        onSubmit(name.trim())
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [name])

  const handleBlur = () => {
    if (name.trim()) {
      onSubmit(name.trim())
    } else {
      onCancel()
    }
  }

  return (
    <StyledSeriesFile ref={containerRef}>
      {type === 'folder' ? (
        <IconFolder width={24} height={24} />
      ) : (
        <IconArticle width={24} height={24} />
      )}
      <TextArea
        ref={inputRef}
        fontType="B2"
        color={color.G800}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`${type === 'folder' ? '폴더' : '파일'} 명을 입력해주세요`}
        width="100%"
        rows={1}
        onBlur={handleBlur}
      />
    </StyledSeriesFile>
  )
}

export default TempObject

const StyledSeriesFile = styled.div`
  ${flex({ alignItems: 'center' })}
  width: 100%;
  padding: 4px;
  gap: 8px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${color.G20};
  }
`
