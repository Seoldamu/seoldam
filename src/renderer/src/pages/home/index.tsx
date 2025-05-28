import { Chart, Series } from '@renderer/components/home'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

const Home = () => {
  return (
    <StyledHome>
      <Chart />
      <Series />
    </StyledHome>
  )
}

export default Home

const StyledHome = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'center' })}
  width: 100%;
  padding: 50px 148px 50px 88px;
  gap: 80px;
`
