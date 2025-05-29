import { Button, Column, OverlayWrapper, Row, TextArea } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { useOutsideClick } from '@renderer/hooks'
import { flex } from '@renderer/utils'
import { useState } from 'react'
import { styled } from 'styled-components'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const SeriesCreateModal = ({ isOpen, onClose }: Props) => {
  const [seriesTitle, setSeriesTitle] = useState('')
  if (!isOpen) return null

  const modalRef = useOutsideClick<HTMLDivElement>(onClose)

  const handleCreate = async () => {
    const result = await window.api.createSeries(seriesTitle)
    if (result.success) {
      alert(`성공적으로 생성됨: ${result.path}`)
    } else {
      alert(`실패: ${result.message}`)
    }
  }

  return (
    <OverlayWrapper>
      <StyledSeriesCreateModal ref={modalRef}>
        <SeriesCover src="DefaultSeriesCover.png" />
        <Column width={341} justifyContent="space-between">
          <TextArea
            value={seriesTitle}
            onChange={(e) => {
              setSeriesTitle(e.target.value)
            }}
            fontType="T4"
            color={color.G900}
            placeholder="시리즈 이름을 입력해주세요."
            rows={3}
          />
          <Row gap={6} alignItems="center" justifyContent="flex-end">
            <Button property="DISABLED" onClick={onClose}>
              취소
            </Button>
            <Button property="DEFAULT" onClick={handleCreate}>
              생성
            </Button>
          </Row>
        </Column>
      </StyledSeriesCreateModal>
    </OverlayWrapper>
  )
}

export default SeriesCreateModal

const StyledSeriesCreateModal = styled.div`
  ${flex({ alignItems: 'center', flexDirection: 'row' })}
  height: 152px;
  width: 489px;
  padding: 16px;
  gap: 20px;

  border-radius: 14px;
  background: ${color.G0};
`

const SeriesCover = styled.img`
  width: 96px;
  height: 120px;
  aspect-ratio: 4/5;

  border-radius: 8px;
`
