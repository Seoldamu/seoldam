import { color, font } from '@renderer/design/styles'
import { flex } from '@renderer/utils'
import { styled } from 'styled-components'
import Toolbar from './Toolbar/Toolbar'
import SavePanel from './SavePanel/SavePanel'
import { useRef } from 'react'

const FileEditor = () => {
  const fileNameRef = useRef<HTMLDivElement>(null)
  const fileContentRef = useRef<HTMLDivElement>(null)

  const handleFileNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fileContentRef.current?.focus()
    }
  }

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.textContent === '') {
      el.innerHTML = ''
    }
  }

  return (
    <StyledFileEditor>
      <FileEditorHeader>
        <Toolbar />
        <SavePanel />
      </FileEditorHeader>
      <WriteBox>
        <FileName
          ref={fileNameRef}
          contentEditable
          data-placeholder="파일 이름을 입력하세요"
          onKeyDown={handleFileNameKeyDown}
          spellCheck={false}
          onInput={handleOnInput}
        />
        <FileCotent
          ref={fileContentRef}
          contentEditable
          data-placeholder="내용을 입력하세요"
          spellCheck={false}
          onInput={handleOnInput}
        />
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
  ${flex({ justifyContent: 'space-between' })}
  width: 80%;
  padding: 0px 24px 0px 24px;
`

const WriteBox = styled.div`
  ${flex({ flexDirection: 'column' })}
  width: 70%;
  height: auto;
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

const FileCotent = styled.div`
  ${font.B1}
  color: ${color.G500};
  width: 100%;
  min-height: 200px;
  outline: none;
  &:empty:before {
    content: attr(data-placeholder);
    color: ${color.G80};
  }
`
