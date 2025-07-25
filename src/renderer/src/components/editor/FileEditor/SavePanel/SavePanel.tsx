import { Button, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  onSave: () => void
  charCount: number
}

const SavePanel = ({ onSave, charCount }: Props) => {
  return (
    <StyledSavePanel>
      <Text fontType="B2" color={color.G700}>
        {charCount.toLocaleString()}자
      </Text>
      <Button property="DEFAULT" size="SMALL" onClick={onSave}>
        저장
      </Button>
    </StyledSavePanel>
  )
}

export default SavePanel

const StyledSavePanel = styled.div`
  ${flex({ alignItems: 'center' })}
  gap: 20px;
`
