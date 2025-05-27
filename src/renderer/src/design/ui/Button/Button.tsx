import { color, font } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import styled, { CSSProperties } from 'styled-components'

type ButtonProperty = 'DEFAULT' | 'DISABLED'

type ButtonSize = 'SMALL'

type Props = {
  children: ReactNode
  property: ButtonProperty
  size?: ButtonSize
  width?: CSSProperties['width']
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ onClick, children, property, width, style, disabled }: Props) => {
  return (
    <StyledButton
      property={property}
      style={{ width, ...style }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  )
}

export default Button

const StyledButton = styled.button<{ property: ButtonProperty }>`
  ${flex({ alignItems: 'center', justifyContent: 'center' })}
  width: fit-content;
  padding: 6px 14px;
  word-break: keep-all;
  box-sizing: border-box;
  gap: 8px;

  border-radius: 6px;
  ${font.L2}
  ${({ property }) =>
    property === 'DEFAULT'
      ? `
        background: ${color.primary};
        color: ${color.G0};
      `
      : `
        background: ${color.G20};
        color: ${color.G600};
      `}
`
