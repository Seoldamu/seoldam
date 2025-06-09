import { Button, OverlayWrapper, Row, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import MonthSelector from './MonthSelector/MonthSelector'
import { useEffect, useState } from 'react'
import { Month } from '@renderer/types/home/type'
import { useOutsideClick } from '@renderer/hooks'

interface Props {
  isOpen: boolean
  onClose: () => void
  compareMonth: Month
  comparedMonth: Month
  onChangeCompareMonth: (value: Month) => void
  onChangeComparedMonth: (value: Month) => void
}

const ChangeMonthModal = ({
  isOpen,
  onClose,
  compareMonth,
  comparedMonth,
  onChangeCompareMonth,
  onChangeComparedMonth
}: Props) => {
  const [tempCompare, setTempCompare] = useState<Month>(compareMonth)
  const [tempCompared, setTempCompared] = useState<Month>(comparedMonth)

  const handleCancel = () => {
    setTempCompare(compareMonth)
    setTempCompared(comparedMonth)
    onClose()
  }

  const handleConfirm = () => {
    onChangeCompareMonth(tempCompare)
    onChangeComparedMonth(tempCompared)
    onClose()
  }

  const modalRef = useOutsideClick<HTMLDivElement>(handleCancel)

  useEffect(() => {
    if (isOpen) {
      setTempCompare(compareMonth)
      setTempCompared(comparedMonth)
    }
  }, [isOpen, compareMonth, comparedMonth])

  if (!isOpen) return null

  return (
    <OverlayWrapper>
      <StyledChangeMonthModal ref={modalRef}>
        <Text fontType="T4" color={color.G900}>
          달 변경
        </Text>
        <Row justifyContent="space-between" alignItems="center">
          <MonthSelector label="비교 대상 1" value={tempCompare} onChange={setTempCompare} />
          <MonthSelector label="비교 대상 2" value={tempCompared} onChange={setTempCompared} />
        </Row>
        <Row gap={6} alignItems="center" justifyContent="flex-end">
          <Button property="DISABLED" onClick={handleCancel}>
            취소
          </Button>
          <Button property="DEFAULT" onClick={handleConfirm}>
            확인
          </Button>
        </Row>
      </StyledChangeMonthModal>
    </OverlayWrapper>
  )
}

export default ChangeMonthModal

const StyledChangeMonthModal = styled.div`
  ${flex({ flexDirection: 'column', justifyContent: 'center' })}
  width: 400px;
  padding: 18px 14px;
  gap: 24px;
  border-radius: 14px;
  background: ${color.G0};
`
