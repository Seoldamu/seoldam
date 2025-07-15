import { font } from '@renderer/design/styles'
import type { HTMLAttributes, ReactNode } from 'react'
import styled, { CSSProperties, css } from 'styled-components'

type Font = keyof typeof font

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  color?: CSSProperties['color']
  fontType?: Font
  width?: CSSProperties['width']
  textAlign?: CSSProperties['textAlign']
  ellipsis?: boolean | number
  whiteSpace?: CSSProperties['whiteSpace']
  tag?: 'span' | 'p'
}

const Text = ({
  children,
  color,
  fontType = 'H1',
  width = 'auto',
  textAlign = 'left',
  ellipsis = false,
  whiteSpace = 'nowrap',
  tag = 'span'
}: TextProps) => {
  return (
    <StyledText
      style={{ color, textAlign, width, whiteSpace }}
      fontType={fontType}
      as={tag}
      ellipsis={ellipsis}
    >
      {children}
    </StyledText>
  )
}

export default Text

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
