import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { marked } from 'marked'
import TurndownService from 'turndown'

import { color, font } from '@renderer/design/styles'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore, useTodayCharCountStore } from '@renderer/stores'
import { flex } from '@renderer/utils'
import { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

import SavePanel from './SavePanel/SavePanel'
import Toolbar from './Toolbar/Toolbar'
import { FormatState } from '@renderer/types/editor/clinet'

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  preformattedCode: true
})

turndownService.addRule('underline', {
  filter: ['u'],
  replacement: (content) => `__${content}__`
})

const FileEditor = () => {
  const { currentPath, setCurrentPath } = useSeriesStore()
  const { fetchTreeData } = useSeriesTreeStore()
  const { todayCharCount, setTodayCharCount } = useTodayCharCountStore()

  const fileNameRef = useRef<HTMLDivElement>(null)

  const [fileName, setFileName] = useState('')
  const [initialContent, setInitialContent] = useState('')
  const [prevCharCount, setPrevCharCount] = useState(0)
  const [formatState, setFormatState] = useState<FormatState>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false
  })

  const editor = useEditor({
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
    const loadFileInfo = async () => {
      if (!currentPath) return

      const result = await fileSystemService.getFileInfo(currentPath)
      setFileName(result.fileName)

      const htmlContent = await marked.parse(result.content)
      setInitialContent(htmlContent)
    }

    loadFileInfo()
  }, [currentPath])

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent, { emitUpdate: false })
      const initialCharCount = turndownService.turndown(initialContent).length
      setPrevCharCount(initialCharCount)
    }
  }, [editor, initialContent])

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.textContent = fileName
    }
  }, [fileName])

  const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editor?.chain().focus().run()
    }
  }

  const handleFileSave = async () => {
    if (!currentPath || !fileNameRef.current || !editor) return

    const newFileName = fileNameRef.current.textContent?.trim() || ''
    const contentHTML = editor.getHTML()
    const markdownText = turndownService.turndown(contentHTML)

    const oldPath = currentPath
    const oldFileName = fileName

    let pathToSave = currentPath

    if (newFileName && newFileName !== oldFileName) {
      const renameResult = await fileSystemService.rename(oldPath, newFileName)
      if (!renameResult.success) {
        alert(renameResult.message)
        return
      }
      pathToSave = renameResult.path
      setCurrentPath(pathToSave)
    }

    const saveResult = await fileSystemService.saveFile(pathToSave, markdownText)
    if (!saveResult.success) {
      alert(saveResult.message)
      return
    }

    const newCharCount = markdownText.length
    const diff = newCharCount - prevCharCount

    if (diff > 0) {
      setTodayCharCount(todayCharCount + diff)
    }
    setPrevCharCount(newCharCount)

    setFileName(newFileName)
    fetchTreeData()
  }

  if (!editor) {
    return null
  }

  return (
    <StyledFileEditor>
      <FileEditorHeader>
        <Toolbar editor={editor} formatState={formatState} />
        <SavePanel charCount={editor.storage.characterCount.characters()} onSave={handleFileSave} />
      </FileEditorHeader>
      <WriteBox>
        <FileName
          ref={fileNameRef}
          contentEditable
          data-placeholder="파일 이름을 입력하세요"
          onKeyDown={handleFileNameKeyDown}
          onInput={(e) => {
            if (e.currentTarget.textContent === '') {
              e.currentTarget.innerHTML = ''
            }
          }}
          spellCheck={false}
          suppressContentEditableWarning={true}
        />
        <FileContent>
          <EditorContent editor={editor} />
        </FileContent>
      </WriteBox>
    </StyledFileEditor>
  )
}

export default FileEditor

const StyledFileEditor = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  padding: 40px 0px 0px 102px;
  gap: 19px;
  background: ${color.G0};
`

const FileEditorHeader = styled.div`
  ${flex({ justifyContent: 'space-between', alignItems: 'center' })}
  width: 80%;
  padding: 0px 24px 0px 24px;
  position: relative;
`

const WriteBox = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 70%;
  min-height: 300px;
  padding: 38px 24px 738px 24px;
  gap: 8px;
`

const FileName = styled.div`
  ${font.T2}
  color: ${color.G800};
  width: 100%;
  min-height: 32px;
  outline: none;
  &:empty:before {
    content: attr(data-placeholder);
    color: ${color.G80};
  }
`

const FileContent = styled.div`
  .ProseMirror {
    ${font.B1}
    color: ${color.G500};
    width: 100%;
    min-height: 200px;
    outline: none;

    display: block;

    & > * {
      display: block;
    }

    &:focus {
      outline: none;
    }

    p {
      margin-block-start: 1em;
      margin-block-end: 1em;
    }

    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${color.G80};
      pointer-events: none;
      height: 0;
    }
  }
`
