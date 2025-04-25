import { useCounterStore } from '@renderer/stores/counterStore'
import styled from 'styled-components'

function CheckZustand() {
  const { count, increase, decrease } = useCounterStore()

  return (
    <div>
      <h1>Zustand Counter</h1>
      <p>Count: {count}</p>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <Wrapper>
        <Title>안녕, 리액트!</Title>
      </Wrapper>
    </div>
  )
}

export default CheckZustand

const Wrapper = styled.div`
  padding: 1em;
  background: blue;
`

const Title = styled.h1`
  font-size: 1.5em;
  color: white;
  text-align: center;
`
