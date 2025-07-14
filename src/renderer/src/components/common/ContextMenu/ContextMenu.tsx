import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Data {
  label: string
  value: string
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

interface Props {
  data: Data[]
}

const ContextMenu = ({ data }: Props) => {
  return (
    <StyledContextMenu>
      {data.map((item) => (
        <ContextMenuItem
          key={item.value}
          onClick={(e) => {
            e.stopPropagation()
            item.onClick(e)
          }}
        >
          {item.label}
        </ContextMenuItem>
      ))}
    </StyledContextMenu>
  )
}

export default ContextMenu

const StyledContextMenu = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 200px;
  padding: 8px 0px;
  gap: 4px;

  border-radius: 12px;
  background: ${color.G0};
  box-shadow:
    0px 53px 15px 0px rgba(112, 112, 112, 0),
    0px 34px 14px 0px rgba(112, 112, 112, 0.01),
    0px 19px 12px 0px rgba(112, 112, 112, 0.05),
    0px 9px 9px 0px rgba(112, 112, 112, 0.09),
    0px 2px 5px 0px rgba(112, 112, 112, 0.1);
`

const ContextMenuItem = styled.div`
  ${flex({ alignItems: 'center' })}
  padding: 10px 16px;
  gap: 8px;
  width: 100%;

  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${color.G20};
  }
`
