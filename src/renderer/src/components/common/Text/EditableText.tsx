import { color, font } from '@renderer/design/styles'
import { useBoolean, useOutsideClick } from '@renderer/hooks'
import { useEffect, useRef, useState } from 'react'
import styled, { CSSProperties, css } from 'styled-components'

type Font = keyof typeof font

interface Props {
  value: string
  onChange: (value: string) => void
  color?: string
  fontType?: Font
  width?: CSSProperties['width']
  maxWidth?: CSSProperties['maxWidth']
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
  maxWidth = 'auto',
  textAlign = 'left',
  ellipsis = false,
  whiteSpace = 'nowrap',
  tag = 'span',
  ...rest
}: Props) => {
  const { value: editing, setTrue: startEdit, setFalse: endEdit } = useBoolean(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const wrapperRef = useOutsideClick<HTMLDivElement>(() => {
    if (editing) endEdit()
  })

  const [inputWidth, setInputWidth] = useState<number>(0)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (editing && spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth
      const max =
        typeof maxWidth === 'number'
          ? maxWidth
          : typeof maxWidth === 'string' && maxWidth.endsWith('px')
            ? parseInt(maxWidth)
            : 300
      setInputWidth(Math.min(spanWidth + 2, max))
    }
  }, [editValue, editing, fontType, maxWidth])

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
    <div
      ref={wrapperRef}
      style={{
        display: 'inline-block',
        width: 'auto',
        maxWidth,
        verticalAlign: 'middle'
      }}
    >
      {editing ? (
        <>
          <EditableTextInput
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            fontType={fontType}
            style={{
              color,
              textAlign,
              width: inputWidth ? `${inputWidth}px` : 'auto',
              maxWidth,
              whiteSpace: 'nowrap',
              overflowX: 'auto'
            }}
            {...rest}
          />
          <HiddenSpan ref={spanRef} fontType={fontType}>
            {editValue || ' '}
          </HiddenSpan>
        </>
      ) : (
        <StyledEditableText
          style={{
            color,
            textAlign,
            width: 'auto',
            maxWidth,
            whiteSpace,
            cursor: 'pointer'
          }}
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
        </StyledEditableText>
      )}
    </div>
  )
}

export default EditableText

const StyledEditableText = styled.span<{ fontType: Font; ellipsis?: boolean | number }>`
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

const EditableTextInput = styled.input<{ fontType: Font }>`
  ${({ fontType }) => font[fontType]};
  border: none;
  outline: none;
  background: ${color.G20};
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  color: inherit;
  border-radius: 4px;
  white-space: nowrap;
  overflow-x: auto;
`

const HiddenSpan = styled.span<{ fontType: Font }>`
  ${({ fontType }) => font[fontType]};
  position: absolute;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  white-space: pre;
  pointer-events: none;
`
