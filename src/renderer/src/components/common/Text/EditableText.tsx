import { useRef, useState, useEffect } from 'react'
import styled, { CSSProperties, css } from 'styled-components'
import { color, font } from '@renderer/design/styles'
import { useBoolean, useOutsideClick } from '@renderer/hooks'

type Font = keyof typeof font

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  color?: string
  fontType?: Font
  width?: CSSProperties['width']
  textAlign?: CSSProperties['textAlign']
  ellipsis?: boolean | number
  whiteSpace?: CSSProperties['whiteSpace']
  tag?: 'span' | 'p'
}

const EditableText = ({
  value,
  onChange,
  color,
  fontType = 'H1',
  width = 'auto',
  textAlign = 'left',
  ellipsis = false,
  whiteSpace = 'nowrap',
  tag = 'span',
  ...rest
}: EditableTextProps) => {
  const { value: editing, setTrue: startEdit, setFalse: endEdit } = useBoolean(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useOutsideClick<HTMLDivElement>(() => {
    if (editing) endEdit()
  })

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleEditEnd = () => {
    endEdit()
    if (editValue !== value) {
      onChange(editValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEditEnd()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      endEdit()
    }
  }

  return (
    <div ref={wrapperRef} style={{ display: 'inline-block', width }}>
      {editing ? (
        <InputLike
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          fontType={fontType}
          style={{ color, textAlign, width: '100%', whiteSpace }}
          {...rest}
        />
      ) : (
        <StyledText
          style={{ color, textAlign, width, whiteSpace, cursor: 'pointer' }}
          fontType={fontType}
          as={tag}
          ellipsis={ellipsis}
          onClick={startEdit}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') startEdit()
          }}
          {...rest}
        >
          {value}
        </StyledText>
      )}
    </div>
  )
}

export default EditableText

const StyledText = styled.span<{ fontType: Font; ellipsis?: boolean | number }>`
  ${({ fontType }) => font[fontType]};
  ${({ ellipsis }) =>
    ellipsis === true &&
    css`
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}
  ${({ ellipsis }) =>
    typeof ellipsis === 'number' &&
    css`
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: ${ellipsis};
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      white-space: normal;
    `}
`

const InputLike = styled.input<{ fontType: Font }>`
  ${({ fontType }) => font[fontType]};
  border: none;
  outline: none;
  background: ${color.G20};
  width: auto;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  color: inherit;

  border-radius: 4px;
`
