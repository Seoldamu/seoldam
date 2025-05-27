import { Text } from '@renderer/components/common'
import { IconFolder } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useBoolean, useOutsideClick } from '@renderer/hooks'
import { flex } from '@renderer/utils'
import { ReactNode } from 'react'
import { CSSProperties, styled } from 'styled-components'

interface Data {
  label: string
  value: string
}

interface Props {
  icon?: ReactNode
  name: string
  label: string
  value: string
  data: Data[]
  onChange: (value: Data, name: string) => void
  placeholder?: string
  width?: CSSProperties['width']
  disabled?: boolean
}

const MiniDropdown = ({
  icon = <IconFolder width={20} height={20} />,
  name,
  label,
  data,
  onChange,
  placeholder,
  width = '124px',
  disabled = false
}: Props) => {
  const { value: isOpen, setFalse: closeDropdown, toggle: handleToggleButtonClick } = useBoolean()
  const dropdownRef = useOutsideClick<HTMLDivElement>(closeDropdown)

  const handleDropdownItemClick = (data: Data) => {
    if (!disabled) {
      onChange(data, name)
      closeDropdown()
    }
  }

  const handleDropdownClick = () => {
    if (!disabled) {
      handleToggleButtonClick()
    }
  }

  return (
    <div ref={dropdownRef} style={{ width }}>
      <StyledMiniDropdown onClick={handleDropdownClick} $isOpen={isOpen}>
        {icon}
        <Text fontType="L2" color={color.G700} ellipsis={true}>
          {label || placeholder}
        </Text>
      </StyledMiniDropdown>
      <MiniDropdownListBox $isOpen={isOpen && !disabled}>
        <MiniDropdownList>
          {data?.map((item, index) => {
            return (
              <MiniDropdownItem
                key={`dropdown ${index}`}
                onClick={() => handleDropdownItemClick(item)}
              >
                {item.label}
              </MiniDropdownItem>
            )
          })}
        </MiniDropdownList>
      </MiniDropdownListBox>
    </div>
  )
}

export default MiniDropdown

const StyledMiniDropdown = styled.div<{
  $isOpen: boolean
}>`
  ${flex({ alignItems: 'center' })}
  width: 100%;
  gap: 4px;
  cursor: pointer;
  background: ${color.G0};
`

const MiniDropdownListBox = styled.div<{ $isOpen: boolean }>`
  position: relative;
  top: 100%;
  left: 24px;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`

const MiniDropdownList = styled.div`
  position: absolute;
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
  padding: 4px 0px;
  gap: 2px;
  z-index: 1;

  border-radius: 4px;
  background: ${color.G0};
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
`

const MiniDropdownItem = styled.button`
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
