import { IconFolder } from '@renderer/design/icons'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import { Column, Text } from '@renderer/components/common'
import { color } from '@renderer/design/styles'
import SeriesFile from '../SeriesFile/SeriesFile'
import { useState } from 'react'
import { TreeNode } from '@renderer/types/series/type'

interface Props {
  node: TreeNode
}

const SeriesFolder = ({ node }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <StyledSeriesFolder>
      <IconFolder width={24} height={24} active={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <Column gap={10}>
        <Text fontType="B2" color={color.G800} ellipsis={true}>
          {node.name}
        </Text>
        {isOpen &&
          node.children?.map((child, i) =>
            child.type === 'folder' ? (
              <SeriesFolder key={`${node.name}-${i}`} node={child} />
            ) : (
              <SeriesFile key={`${node.name}-${i}`} node={child} />
            )
          )}
      </Column>
    </StyledSeriesFolder>
  )
}

export default SeriesFolder

const StyledSeriesFolder = styled.div`
  ${flex({ alignItems: 'flex-start' })}
  width: 100%;
  padding: 4px;
  gap: 8px;
`
