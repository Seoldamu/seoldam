import Chart from '@renderer/components/home/Chart/Chart'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

const Home = () => {
  return (
    <StyledHome>
      <Chart />;
    </StyledHome>
  )
}

export default Home

const StyledHome = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'center' })}
  padding: 50px 144px 50px 88px;
  gap: 80px;
`
