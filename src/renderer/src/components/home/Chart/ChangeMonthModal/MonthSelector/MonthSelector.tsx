import { Column, Text } from '@renderer/components/common'
import { IconArrowDirection } from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import styled, { CSSProperties } from 'styled-components'

type Month = { year: number; month: number }

interface Props {
  label?: string
  value: Month
  onChange: (value: Month) => void
  width?: CSSProperties['width']
}

const MonthSelector = ({ label, value, onChange, width = 176 }: Props) => {
  const increaseMonth = () => {
    onChange(
      value.month === 12
        ? { year: value.year + 1, month: 1 }
        : { year: value.year, month: value.month + 1 }
    )
  }

  const decreaseMonth = () => {
    onChange(
      value.month === 1
        ? { year: value.year - 1, month: 12 }
        : { year: value.year, month: value.month - 1 }
    )
  }

  return (
    <Column gap={4}>
      <Text fontType="B3" color={color.G300}>
        {label}
      </Text>
      <StyledMonthSelector style={{ width }}>
        <Text fontType="B3" color={color.G700}>{`${value.year}년 ${value.month}월`}</Text>
        <Arrows>
          <IconArrowDirection direction="top" width={24} height={24} onClick={increaseMonth} />
          <IconArrowDirection
            direction="bottom"
            width={24}
            height={24}
            onClick={decreaseMonth}
            style={{ marginTop: '-12px' }}
          />
        </Arrows>
      </StyledMonthSelector>
    </Column>
  )
}

export default MonthSelector

const StyledMonthSelector = styled.div`
  ${flex({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' })}
  height: 40px;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid ${color.G50};
  width: fit-content;
`

const Arrows = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  cursor: pointer;
`
