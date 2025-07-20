import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import Row from '../Flex/Row'
import { IconCheckCircle, IconCloseCircle } from '@renderer/design/icons'
import Text from '../Text/Text'
import { ToastType } from '@renderer/stores'

interface Props {
  message: string
  type: ToastType
  onClose: () => void
}

const Toast = ({ message, type, onClose }: Props) => {
  return (
    <StyledToast onClick={onClose}>
      <Row width="100%" gap={8} justifyContent="center" alignItems="center">
        {type === 'SUCCESS' ? (
          <IconCheckCircle width={32} height={32} />
        ) : (
          <IconCloseCircle width={32} height={32} />
        )}
        <Text fontType="B1" color={color.G900} whiteSpace="normal" style={{ flex: 1 }}>
          {message}
        </Text>
      </Row>
    </StyledToast>
  )
}

export default Toast

const StyledToast = styled.div`
  cursor: pointer;
  ${flex({ alignItems: 'flex-start' })}
  max-width: 257px;
  padding: 20px 16px;

  border-radius: 8px;
  background: ${color.G0};
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);

  opacity: 0;
  animation: fadeInOut 3s ease forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(20px);
    }
  }
`
