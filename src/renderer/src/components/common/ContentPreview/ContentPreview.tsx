import { color } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import Text from '../Text/Text'

interface Props {
  title: string
  content: string
}

const ContentPreview = ({ title, content }: Props) => {
  return (
    <StyledContentPreview>
      <Text fontType="H2" color={color.G900} ellipsis={2}>
        {title}
      </Text>
      <Text fontType="B3" color={color.G100} ellipsis={6}>
        {content}
      </Text>
    </StyledContentPreview>
  )
}

export default ContentPreview

const StyledContentPreview = styled.div`
  ${flex({ alignItems: 'flex-start', flexDirection: 'column' })}
  width: calc(25% - 20px);
  padding: 16px 10px;
  gap: 6px;

  border-radius: 8px;
  background: ${color.G20};
`
