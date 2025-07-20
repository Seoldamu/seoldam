import { Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

const MemoItem = () => {
  return (
    <StyledMemoItem>
      <Text fontType="T4" color={color.G900} ellipsis>
        {'메모제목'}
      </Text>
      <MemoItemDateText>{'마지막 메모 수정 또는 작성 시간(ex 2025.04.18)'}</MemoItemDateText>
    </StyledMemoItem>
  )
}

export default MemoItem

const StyledMemoItem = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
  padding: 14px 0px 14px 12px;
  gap: 2px;

  border-bottom: 1px solid ${color.G30};
  background: ${color.G0};
`

const MemoItemDateText = styled.div`
  color: ${color.G100};
  font-family: Paperlogy;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0.12px;
`
