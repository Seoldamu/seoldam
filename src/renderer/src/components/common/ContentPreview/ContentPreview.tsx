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
      <Text fontType="H2" color={color.G900} ellipsis={2} whiteSpace="normal">
        {title}
      </Text>
      <Text fontType="B3" color={color.G100} ellipsis={6} whiteSpace="normal">
        {content}
      </Text>
    </StyledContentPreview>
  )
}

export default ContentPreview

const StyledContentPreview = styled.div`
  ${flex({ alignItems: 'flex-start', flexDirection: 'column' })}
  width: 100%;
  height: 180px;
  padding: 16px 10px;
  gap: 6px;
  border-radius: 8px;
  background: ${color.G20};
`
