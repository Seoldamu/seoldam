import { Button, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

const SavePanel = () => {
  return (
    <StyledSavePanel>
      <Text fontType="B2" color={color.G700}>
        {`유동적으로 변경되는 글자 수`}자
      </Text>
      <Button property="DEFAULT" size="SMALL">
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
