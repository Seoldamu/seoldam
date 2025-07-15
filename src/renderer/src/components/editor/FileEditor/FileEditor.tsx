import { color, font } from '@renderer/design/styles'
import { countCharacters, flex } from '@renderer/utils'
import { styled } from 'styled-components'
import Toolbar from './Toolbar/Toolbar'
import SavePanel from './SavePanel/SavePanel'
import { useRef, useEffect, useState } from 'react'
import { useSeriesStore, useSeriesTreeStore, useTodayCharCountStore } from '@renderer/stores'

const FileEditor = () => {
  const { currentPath, setCurrentPath } = useSeriesStore()
  const { fetchTreeData } = useSeriesTreeStore()
  const { todayCharCount, setTodayCharCount } = useTodayCharCountStore()

  const fileNameRef = useRef<HTMLDivElement>(null)
  const fileContentRef = useRef<HTMLDivElement>(null)

  const [fileData, setFileData] = useState({ fileName: '', content: '' })
  const [prevCharCount, setPrevCharCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const loadFileInfo = async () => {
      if (!currentPath) return

      const result = await window.api.getFileInfo(currentPath)

      setFileData({
        fileName: result.fileName,
        content: result.content
      })
    }

    loadFileInfo()
  }, [currentPath])

  useEffect(() => {
    if (fileNameRef.current) {
      fileNameRef.current.textContent = fileData.fileName
    }
    if (fileContentRef.current) {
      fileContentRef.current.textContent = fileData.content
    }

    const initialCharCount = countCharacters(fileData.content)
    setCharCount(initialCharCount)
    setPrevCharCount(initialCharCount)
  }, [fileData])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (fileContentRef.current) {
        const text = fileContentRef.current.textContent || ''
        setCharCount(countCharacters(text))
      }
    })

    const target = fileContentRef.current
    if (target) {
      observer.observe(target, {
        characterData: true,
        subtree: true,
        childList: true
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleOnInput = (e: React.FormEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.textContent === '') {
      el.innerHTML = ''
    }
  }

  const handleFileNameKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      fileContentRef.current?.focus()
    }
  }

  const handleFileSave = async () => {
    if (!currentPath || !fileNameRef.current) return

    const newFileName = fileNameRef.current.textContent?.trim() || ''
    const content = fileContentRef.current?.textContent || ''
    const oldPath = currentPath
    const oldFileName = fileData.fileName

    let pathToSave = currentPath

    if (newFileName && newFileName !== oldFileName) {
      const renameResult = await window.api.renamePath(oldPath, newFileName)
      if (!renameResult.success) {
        alert(renameResult.message)
        return
      }
      pathToSave = renameResult.path
      setCurrentPath(pathToSave)
    }

    const saveResult = await window.api.saveFileContent(pathToSave, content)
    if (!saveResult.success) {
      alert(saveResult.message)
      return
    }

    const newCharCount = countCharacters(content)
    const diff = newCharCount - prevCharCount

    if (diff > 0) {
      setTodayCharCount(todayCharCount + diff)
    }
    setPrevCharCount(newCharCount)

    setFileData({
      fileName: newFileName,
      content
    })
    fetchTreeData()
  }

  return (
    <StyledFileEditor>
      <FileEditorHeader>
        <Toolbar />
        <SavePanel charCount={charCount} onSave={handleFileSave} />
      </FileEditorHeader>
      <WriteBox>
        <FileName
          ref={fileNameRef}
          contentEditable
          data-placeholder="파일 이름을 입력하세요"
          onKeyDown={handleFileNameKeyDown}
          onInput={handleOnInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
        />
        <FileContent
          ref={fileContentRef}
          contentEditable
          data-placeholder="내용을 입력하세요"
          onInput={handleOnInput}
          spellCheck={false}
          suppressContentEditableWarning={true}
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
  ${flex({ justifyContent: 'space-between', alignItems: 'center' })}
  width: 80%;
  padding: 0px 24px 0px 24px;
  position: relative;
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

const FileContent = styled.div`
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
