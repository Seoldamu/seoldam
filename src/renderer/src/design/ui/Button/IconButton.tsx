import { color, font } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { CSSProperties, styled } from 'styled-components'
import { IconAdd } from '@renderer/design/icons'

type Props = {
  children: ReactNode
  icon?: ReactNode
  width?: CSSProperties['width']
} & ButtonHTMLAttributes<HTMLButtonElement>

const IconButton = ({
  onClick,
  children,
  icon = <IconAdd fill={color.G0} />,
  width,
  style,
  disabled,
  ...rest
}: Props) => {
  return (
    <StyledButton style={{ width, ...style }} onClick={onClick} disabled={disabled} {...rest}>
      {icon}
      {children}
    </StyledButton>
  )
}

export default IconButton

const StyledButton = styled.button`
  ${flex({ alignItems: 'center', justifyContent: 'center' })}
  padding: 8px 16px;
  word-break: keep-all;
  box-sizing: border-box;
  gap: 8px;

  ${font.L2};
  border-radius: 6px;
  background: ${color.primary};
  color: ${color.G0};
`
