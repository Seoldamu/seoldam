import { styled } from 'styled-components'
import { useToastStore } from '@renderer/stores'
import Toast from './Toast'

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <StyledToastContainer>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </StyledToastContainer>
  )
}

export default ToastContainer

const StyledToastContainer = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
`
