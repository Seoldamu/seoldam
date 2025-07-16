import { Row } from '@renderer/components/common'
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconBookmark,
  IconColorText,
  IconForward,
  IconItalic,
  IconListDot,
  IconListNumber,
  IconStrikethrough,
  IconTimeList,
  IconUnderline
} from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { FormatState } from '@renderer/types/editor/clinet'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  onFormat: (command: 'bold' | 'italic' | 'underline' | 'strikeThrough') => void
  formatState: FormatState
}

const Toolbar = ({ onFormat, formatState }: Props) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <StyledToolbar>
      <Row gap={10}>
        <IconForward width={24} height={24} direction="before" active={false} />
        <IconForward width={24} height={24} direction="after" active={true} />
      </Row>

      <Line />

      <Row gap={10}>
        <IconBold
          width={24}
          height={24}
          onClick={() => onFormat('bold')}
          onMouseDown={handleMouseDown}
          style={{ color: formatState.bold ? color.primary : 'inherit', cursor: 'pointer' }}
        />
        <IconItalic
          width={24}
          height={24}
          onClick={() => onFormat('italic')}
          onMouseDown={handleMouseDown}
          style={{ color: formatState.italic ? color.primary : 'inherit', cursor: 'pointer' }}
        />
        <IconUnderline
          width={24}
          height={24}
          onClick={() => onFormat('underline')}
          onMouseDown={handleMouseDown}
          style={{ color: formatState.underline ? color.primary : 'inherit', cursor: 'pointer' }}
        />
        <IconStrikethrough
          width={24}
          height={24}
          onClick={() => onFormat('strikeThrough')}
          onMouseDown={handleMouseDown}
          style={{
            color: formatState.strikethrough ? color.primary : 'inherit',
            cursor: 'pointer'
          }}
        />
        <IconColorText width={24} height={24} />
      </Row>

      <Line />

      <Row gap={10}>
        <IconAlignLeft width={24} height={24} />
        <IconAlignRight width={24} height={24} />
        <IconAlignCenter width={24} height={24} />
        <IconListDot width={24} height={24} />
        <IconListNumber width={24} height={24} />
      </Row>

      <Line />

      <Row gap={10}>
        <IconBookmark width={24} height={24} />
        <IconTimeList width={24} height={24} />
      </Row>
    </StyledToolbar>
  )
}

export default Toolbar

const StyledToolbar = styled.div`
  ${flex({ alignItems: 'center' })}
  width: 100%;
  gap: 16px;
`

const Line = styled.div`
  width: 1px;
  height: 16px;

  background: ${color.G30};
`
