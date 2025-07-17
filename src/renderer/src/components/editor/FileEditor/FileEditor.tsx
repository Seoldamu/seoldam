import { EditorContent } from '@tiptap/react'
import { useSeriesStore } from '@renderer/stores'
import { useEffect, useRef } from 'react'
import { styled } from 'styled-components'
import { color, font } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import SavePanel from './SavePanel/SavePanel'
import Toolbar from './Toolbar/Toolbar'
import { useFileContent } from './hooks/useFileContent'
import { useTiptapEditor } from './hooks/useTiptapEditor'
import { useFileSave } from './hooks/useFileSave'

const FileEditor = () => {
  const { currentPath } = useSeriesStore()
  const { fileName, setFileName, initialContent } = useFileContent(currentPath)
  const { editor, formatState } = useTiptapEditor({ initialContent })
  const fileNameRef = useRef<HTMLDivElement>(null)
  const { handleFileSave } = useFileSave({ editor, fileName, initialContent, fileNameRef })

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

  const handleFileNameInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newName = e.currentTarget.textContent || ''
    if (newName === '') {
      e.currentTarget.innerHTML = ''
    }
    setFileName(newName)
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
      <ScrollArea>
        <WriteBox>
          <FileName
            ref={fileNameRef}
            contentEditable
            data-placeholder="파일 이름을 입력하세요"
            onKeyDown={handleFileNameKeyDown}
            onInput={handleFileNameInput}
            spellCheck={false}
            suppressContentEditableWarning={true}
          />
          <FileContent>
            <EditorContent editor={editor} />
          </FileContent>
        </WriteBox>
      </ScrollArea>
    </StyledFileEditor>
  )
}

export default FileEditor

const StyledFileEditor = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  height: 100vh;
  padding: 40px 0px 0px 132px;
  gap: 19px;
  background: ${color.G0};
`

const FileEditorHeader = styled.div`
  ${flex({ justifyContent: 'space-between', alignItems: 'center' })}
  width: 80%;
  padding: 0px 24px 0px 24px;
  position: relative;
  flex-shrink: 0;
`

const ScrollArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  padding: 38px 24px 40px 24px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${color.G50};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${color.G100};
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const WriteBox = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 70%;
  height: 100%;
  min-height: 300px;
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
  height: 100%;

  .ProseMirror {
    ${font.B1}
    color: ${color.G500};
    width: 100%;
    height: 100%;
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
