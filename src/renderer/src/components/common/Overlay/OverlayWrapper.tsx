import { ReactNode } from 'react'
import { styled } from 'styled-components'

interface Props {
  children: ReactNode
}

const OverlayWrapper = ({ children }: Props) => {
  return <StyledOverlayWrapper>{children}</StyledOverlayWrapper>
}

export default OverlayWrapper

const StyledOverlayWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: rgba(120, 120, 120, 0.5);
  z-index: 1000;
`
