import { IconArticle, IconFolder } from '@renderer/design/icons'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { TextArea } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useEffect, useRef, useState } from 'react'

interface Props {
  type: 'folder' | 'file'
  onCancel: () => void
  onSubmit: (name: string) => void
}

const TempObject = ({ type, onCancel, onSubmit }: Props) => {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && name.trim()) {
        e.preventDefault()
        onSubmit(name.trim())
      }
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [name])

  return (
    <StyledSeriesFile>
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
        onBlur={onCancel}
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
