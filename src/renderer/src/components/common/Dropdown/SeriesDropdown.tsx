import { Text } from '@renderer/components/common'
import { IconArrowDirection } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { useBoolean, useOutsideClick } from '@renderer/hooks'
import { flex } from '@renderer/utils'
import { ReactNode } from 'react'
import { CSSProperties, styled } from 'styled-components'

interface Data {
  image: string
  value: string
  label: string
}

interface Props {
  icon?: ReactNode
  name: string
  value: string
  data: Data[]
  onChange: (value: string) => void
  width?: CSSProperties['width']
  disabled?: boolean
}

const SeriesDropdown = ({
  icon = <IconArrowDirection width={28} height={28} direction="bottom" />,
  data,
  onChange,
  disabled = false
}: Props) => {
  const { value: isOpen, setFalse: closeDropdown, toggle: handleToggleButtonClick } = useBoolean()
  const dropdownRef = useOutsideClick<HTMLDivElement>(closeDropdown)

  const handleDropdownItemClick = (value: string) => {
    if (!disabled) {
      onChange(value)
      closeDropdown()
    }
  }

  const handleDropdownClick = () => {
    if (!disabled) {
      handleToggleButtonClick()
    }
  }

  return (
    <div ref={dropdownRef}>
      <StyledSeriesDropdown onClick={handleDropdownClick} $isOpen={isOpen}>
        {icon}
      </StyledSeriesDropdown>
      <SeriesDropdownListBox $isOpen={isOpen && !disabled}>
        <SeriesDropdownList>
          {data?.map((item) => {
            return (
              <SeriesDropdownItem
                key={`dropdown ${item.value}`}
                onClick={() => handleDropdownItemClick(item.value)}
              >
                <SeriesDropdownItemImage src={item.image} />
                <Text fontType="L2" color={color.G900} ellipsis={true}>
                  {item.label}
                </Text>
              </SeriesDropdownItem>
            )
          })}
        </SeriesDropdownList>
      </SeriesDropdownListBox>
    </div>
  )
}

export default SeriesDropdown

const StyledSeriesDropdown = styled.div<{
  $isOpen: boolean
}>`
  ${flex({ alignItems: 'center' })}
  width: 100%;
  gap: 4px;
  cursor: pointer;
  background: ${color.G0};
`

const SeriesDropdownListBox = styled.div<{ $isOpen: boolean }>`
  position: relative;
  width: 324px;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
`

const SeriesDropdownList = styled.div`
  position: absolute;
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
  padding: 8px 4px;
  gap: 4px;
  z-index: 1;

  border-radius: 12px;
  background: ${color.G0};
  box-shadow:
    0px 53px 15px 0px rgba(112, 112, 112, 0),
    0px 34px 14px 0px rgba(112, 112, 112, 0.01),
    0px 19px 12px 0px rgba(112, 112, 112, 0.05),
    0px 9px 9px 0px rgba(112, 112, 112, 0.09),
    0px 2px 5px 0px rgba(112, 112, 112, 0.1);
`

const SeriesDropdownItem = styled.button`
  ${flex({ alignItems: 'center' })}
  padding: 5px 8px;
  gap: 10px;
  width: 100%;

  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: ${color.G20};
  }
`

const SeriesDropdownItemImage = styled.img`
  border-radius: 4px;
  width: 28px;
  height: 40px;
  aspect-ratio: 7/10;
  object-fit: cover;
`
