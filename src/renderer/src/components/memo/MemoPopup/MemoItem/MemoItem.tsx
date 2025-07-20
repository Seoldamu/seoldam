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
      <Text fontType="H1" color={color.G900} ellipsis>
        {title}
      </Text>
      <Text fontType="B3" color={color.G100}>
        {updateAt}
      </Text>
    </StyledMemoItem>
  )
}

export default MemoItem

const StyledMemoItem = styled.div`
  ${flex({ flexDirection: 'column', alignItems: 'flex-start' })}
  width: 100%;
  padding: 12px 0px 12px 6px;

  border-bottom: 1px solid ${color.G30};
  cursor: pointer;
`
