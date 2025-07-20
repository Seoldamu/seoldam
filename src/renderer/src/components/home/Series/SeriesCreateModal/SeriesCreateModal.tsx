import { Button, Column, OverlayWrapper, Row, TextArea } from '@renderer/components/common'
import ImageUploader from '@renderer/components/common/Image/ImageUploader'
import { color } from '@renderer/design/styles'
import { useOutsideClick, useToast } from '@renderer/hooks'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { seriesService } from '@renderer/services/seriesService'
import { flex } from '@renderer/utils'
import { useState } from 'react'
import { styled } from 'styled-components'

interface Props {
  isOpen: boolean
  onClose: () => void
  refreshSeriesList: () => void
}

const SeriesCreateModal = ({ isOpen, onClose, refreshSeriesList }: Props) => {
  const [seriesTitle, setSeriesTitle] = useState('')
  const [seriesImage, setSeriesImage] = useState<File | null>(null)

  const modalRef = useOutsideClick<HTMLDivElement>(onClose)
  const toast = useToast()

  if (!isOpen) return null

  const handleCreate = async () => {
    if (!seriesImage) {
      toast('ERROR', `이미지를 추가해주세요`)
      return
    }
    const seriesImagePath = await fileSystemService.getPathForFile(seriesImage)
    const result = await seriesService.create(seriesTitle, seriesImagePath)
    if (result.success) {
      toast('SUCCESS', `성공적으로 시리즈가 생성되었습니다`)
      refreshSeriesList()
    } else {
      toast('ERROR', `${result.message}`)
    }
    onClose()
  }

  return (
    <OverlayWrapper>
      <StyledSeriesCreateModal ref={modalRef}>
        <ImageUploader
          width={96}
          height={120}
          borderRadius={8}
          value={seriesImage}
          onChange={setSeriesImage}
        />
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
