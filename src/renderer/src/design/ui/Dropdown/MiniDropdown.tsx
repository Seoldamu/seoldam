import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Data {
  label: string
  value: string
}

interface Props {
  name: string
  value: string
  data: Data[]
  onSelect: (name: string, value: string) => void
}

const MiniDropdown = ({ name, data, onSelect }: Props) => {
  const handleSelect = (value: string) => {
    onSelect(value, name)
  }

  return (
    <StyledMiniDropdown>
      {data.map((item) => (
        <MiniDropdownItem key={item.value} onClick={() => handleSelect(item.value)}>
          {item.label}
        </MiniDropdownItem>
      ))}
    </StyledMiniDropdown>
  )
}

export default MiniDropdown

const StyledMiniDropdown = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 130px;
  padding: 4px 0px;
  gap: 8px;

  border-radius: 4px;
  background: ${color.G0};
`

const MiniDropdownItem = styled.div`
  ${flex({ alignItems: 'center' })}
  padding: 5px 4px 5px 6px;
  gap: 8px;
  width: 100%;

  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${color.G20};
  }
`
