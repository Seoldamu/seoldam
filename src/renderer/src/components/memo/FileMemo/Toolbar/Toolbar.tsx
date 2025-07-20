import { Editor } from '@tiptap/react'
import { Row } from '@renderer/components/common'
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconColorText,
  IconForward,
  IconItalic,
  IconListDot,
  IconListNumber,
  IconStrikethrough,
  IconUnderline
} from '@renderer/design/icons'
import { color } from '@renderer/design/styles'
import { FormatState } from '@renderer/types/editor/clinet'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'

interface Props {
  editor: Editor | null
  formatState: FormatState
}

const Toolbar = ({ editor, formatState }: Props) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  if (!editor) {
    return null
  }

  return (
    <StyledToolbar>
      <Row gap={10}>
        <IconForward
          width={24}
          height={24}
          direction="before"
          active={editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          onMouseDown={handleMouseDown}
          style={{ cursor: 'pointer' }}
        />
        <IconForward
          width={24}
          height={24}
          direction="after"
          active={editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          onMouseDown={handleMouseDown}
          style={{ cursor: 'pointer' }}
        />
      </Row>

      <Line />

      <Row gap={10}>
        <IconBold
          width={24}
          height={24}
          onClick={() => editor.chain().focus().toggleBold().run()}
          onMouseDown={handleMouseDown}
          style={{ color: formatState.bold ? color.primary : 'inherit', cursor: 'pointer' }}
        />
        <IconItalic
          width={24}
          height={24}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          onMouseDown={handleMouseDown}
          style={{ color: formatState.italic ? color.primary : 'inherit', cursor: 'pointer' }}
        />
        <IconUnderline
          width={24}
          height={24}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          onMouseDown={handleMouseDown}
          style={{ color: formatState.underline ? color.primary : 'inherit', cursor: 'pointer' }}
        />
        <IconStrikethrough
          width={24}
          height={24}
          onClick={() => editor.chain().focus().toggleStrike().run()}
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
