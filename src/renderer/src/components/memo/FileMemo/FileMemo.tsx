import { EditorContent } from '@tiptap/react'
import { useMemoStore } from '@renderer/stores'
import { styled } from 'styled-components'
import { color, font } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useFileContent, useTiptapEditor, useToast } from '@renderer/hooks'
import { Button } from '@renderer/components/common'
import { useEffect, useRef } from 'react'
import Toolbar from './Toolbar/Toolbar'

const FileMemo = () => {
  const { currentMemoPath, setCurrentMemoPath } = useMemoStore()
  const { fileName, setFileName, initialContent } = useFileContent(currentMemoPath)
  const { editor, formatState } = useTiptapEditor({ initialContent })
  const toast = useToast()
  const fileNameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.textContent = fileName.replace(/\.md$/, '')
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

  const handleSave = async () => {
    if (!editor || !currentMemoPath || !fileNameRef.current) return

    const newFileName = fileNameRef.current.textContent?.trim()
    const content = editor.getHTML()
    const originalFileName = currentMemoPath.split('\\').pop()?.replace(/\.md$/, '')

    let savePath = currentMemoPath

    if (newFileName && newFileName !== originalFileName) {
      const renameResult = await fileSystemService.rename(currentMemoPath, `${newFileName}`)

      if (!renameResult.success) {
        toast('ERROR', '파일명 변경에 실패했습니다')
        return
      }

      savePath = renameResult.path
      setCurrentMemoPath(savePath)
    }

    const result = await fileSystemService.saveFile(savePath, content)
    if (result.success) {
      toast('SUCCESS', '메모가 저장되었습니다.')
    } else {
      toast('ERROR', '메모 저장에 실패했습니다.')
    }
  }

  if (!editor) {
    return null
  }

  return (
    <StyledFileMemo>
      <FileMemoHeader>
        <Toolbar editor={editor} formatState={formatState} />
        <Button property="DEFAULT" onClick={handleSave}>
          저장
        </Button>
      </FileMemoHeader>
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
    </StyledFileMemo>
  )
}

export default FileMemo

const StyledFileMemo = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 100%;
  height: 100vh;
  padding: 40px 0px 0px 132px;
  gap: 19px;
  background: ${color.G0};
`

const FileMemoHeader = styled.div`
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
    background-color: ${color.G40};
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: ${color.G80};
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
