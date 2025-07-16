import { marked } from 'marked'
import TurndownService from 'turndown'
import { color, font } from '@renderer/design/styles'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore, useTodayCharCountStore } from '@renderer/stores'
import { countCharacters, flex } from '@renderer/utils'
import { useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

import SavePanel from './SavePanel/SavePanel'
import Toolbar from './Toolbar/Toolbar'

const turndownService = new TurndownService()

turndownService.addRule('underline', {
  filter: ['u'],
  replacement: (content) => `__${content}__`
})

turndownService.addRule('strikethrough', {
  filter: ['s', 'strike'],
  replacement: (content) => `~~${content}~~`
})

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

      const result = await fileSystemService.getFileInfo(currentPath)

      setFileData({
        fileName: result.fileName,
        content: result.content
      })
    }

    loadFileInfo()
  }, [currentPath])

  useEffect(() => {
    const parseMarkdown = async () => {
      if (fileNameRef.current) {
        fileNameRef.current.textContent = fileData.fileName
      }

      if (fileContentRef.current) {
        const html = await marked.parse(fileData.content)
        fileContentRef.current.innerHTML = html
      }

      const initialCharCount = countCharacters(fileData.content)
      setCharCount(initialCharCount)
      setPrevCharCount(initialCharCount)
    }

    parseMarkdown()
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return

    const command = (() => {
      if (e.key === 'b') return 'bold'
      if (e.key === 'i') return 'italic'
      if (e.key === 'u') return 'underline'
      if (e.key.toLowerCase() === 's' && e.shiftKey) return 'strikethrough'
      return null
    })()

    if (!command) return

    e.preventDefault()
    document.execCommand(command)
  }

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
    const contentHTML = fileContentRef.current?.innerHTML || ''
    const markdownText = turndownService.turndown(contentHTML)
    const oldPath = currentPath
    const oldFileName = fileData.fileName

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

    const newCharCount = countCharacters(markdownText)
    const diff = newCharCount - prevCharCount

    if (diff > 0) {
      setTodayCharCount(todayCharCount + diff)
    }
    setPrevCharCount(newCharCount)

    setFileData({
      fileName: newFileName,
      content: markdownText
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
          onKeyDown={handleKeyDown}
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
