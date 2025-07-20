import { Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  title: string
  path: string
  updateAt: string
}

const MemoItem = ({ title, updateAt }: Props) => {
  return (
    <StyledMemoItem>
      <Text fontType="T4" color={color.G900} ellipsis>
        {title}
      </Text>
      <MemoItemDateText>{updateAt}</MemoItemDateText>
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
  cursor: pointer;
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
