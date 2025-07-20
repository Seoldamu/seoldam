import { Sidebar, ToastContainer } from '@renderer/components/common'
import { MemoPopupPortal } from '@renderer/components/memo'
import { flex } from '@renderer/utils'
import { Outlet } from 'react-router-dom'
import { styled } from 'styled-components'

const AppLayout = () => {
  return (
    <StyledAppLayout>
      <ToastContainer />
      <MemoPopupPortal />
      <Sidebar />
      <Section>
        <Outlet />
      </Section>
    </StyledAppLayout>
  )
}

export default AppLayout

const StyledAppLayout = styled.div`
  ${flex({ flexDirection: 'row' })}
  width: 100%;
  height: 100vh;
`

const Section = styled.section`
  flex: 1;
  min-width: 0;
  overflow: auto;
`
