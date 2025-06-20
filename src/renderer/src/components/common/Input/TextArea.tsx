import { color, font } from '@renderer/design/styles'
import { forwardRef, HTMLAttributes } from 'react'
import { CSSProperties } from 'styled-components'
import styled from 'styled-components'

type Font = keyof typeof font

interface Props extends HTMLAttributes<HTMLTextAreaElement> {
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  color?: CSSProperties['color']
  fontType?: Font
  width?: CSSProperties['width']
  textAlign?: CSSProperties['textAlign']
  placeholder?: string
  rows?: number
  wrap?: 'soft' | 'hard' | 'off'
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      value,
      onChange,
      color,
      fontType = 'H1',
      width = 'auto',
      textAlign = 'left',
      placeholder = '텍스트를 입력해주세요',
      rows = 4,
      wrap = 'soft',
      ...rest
    },
    ref
  ) => {
    return (
      <StyledTextArea
        ref={ref}
        style={{ color, textAlign, width }}
        value={value}
        onChange={onChange}
        fontType={fontType}
        rows={rows}
        wrap={wrap}
        placeholder={placeholder}
        {...rest}
      />
    )
  }
)

export default TextArea

const StyledTextArea = styled.textarea<{
  fontType: Font
}>`
  ${({ fontType }) => font[fontType]};
  resize: none;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: ${color.G50};
  }

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`
