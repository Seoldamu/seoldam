import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect, useState } from 'react'
import { FormatState } from '@renderer/types/editor/clinet'

interface UseTiptapEditorProps {
  initialContent: string
  editable?: boolean
}

const useTiptapEditor = ({ initialContent, editable = true }: UseTiptapEditorProps) => {
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  })

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: '내용을 입력하세요'
      }),
      CharacterCount.configure()
    ],
    editorProps: {
      attributes: {
        class: 'ProseMirror'
      }
    },
    onUpdate({ editor }) {
      const newFormatState: FormatState = {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strikethrough: editor.isActive('strike')
      }
      setFormatState(newFormatState)
    },
    onSelectionUpdate({ editor }) {
      const newFormatState: FormatState = {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strikethrough: editor.isActive('strike')
      }
      setFormatState(newFormatState)
    }
  })

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent, { emitUpdate: true })
    }
  }, [editor, initialContent])

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable)
    }
  }, [editor, editable])

  return { editor, formatState }
}

export default useTiptapEditor
