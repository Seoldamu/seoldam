import { Chart, Series } from '@renderer/components/home'
import { color } from '@renderer/design/styles'
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
  height: 100vh;
  padding: 50px 148px 50px 88px;
  gap: 80px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G40};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${color.G80};
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`
