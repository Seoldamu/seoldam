import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import Row from '../Flex/Row'
import { IconCheckCircle, IconCloseCircle } from '@renderer/design/icons'
import Text from '../Text/Text'

interface Props {
  label: string
  type: 'SUCCESS' | 'ERROR'
}

const Toast = ({ label, type }: Props) => {
  return (
    <StyledToast>
      <Row gap={8} justifyContent="center" alignItems="center">
        {type === 'SUCCESS' ? <IconCheckCircle /> : <IconCloseCircle />}
        <Text fontType="B1" color={color.G900}>
          {label}
        </Text>
      </Row>
    </StyledToast>
  )
}

export default Toast

const StyledToast = styled.div`
  ${flex({ alignItems: 'flex-start' })}
  position: fixed;
  top: 50px;
  width: 257px;
  padding: 20px 16px;

  border-radius: 8px;
  background: ${color.G0};
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);

  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  opacity: 0;
  animation: fadeInOut 3s ease forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    10% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    90% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
  }
`
