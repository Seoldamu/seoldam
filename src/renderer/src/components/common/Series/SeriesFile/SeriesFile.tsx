import { IconArticle } from '@renderer/design/icons'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import { TreeNode } from '@renderer/types/series/type'

const SeriesFile = ({ node }: { node: TreeNode }) => {
  return (
    <StyledSeriesFile>
      <IconArticle width={24} height={24} />
      <Text fontType="B2" color={color.G800} ellipsis={true}>
        {node.name}
      </Text>
    </StyledSeriesFile>
  )
}

export default SeriesFile

const StyledSeriesFile = styled.div`
  ${flex({ alignItems: 'center' })}
  width: 100%;
  padding: 4px;
  gap: 8px;

  border-radius: 4px;
`
