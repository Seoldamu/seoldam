import { Editor } from '@tiptap/react'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore, useTodayCharCountStore } from '@renderer/stores'
import TurndownService from 'turndown'
import { useEffect, useState } from 'react'

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

interface UseFileSaveProps {
  editor: Editor | null
  fileName: string
  initialContent: string
  fileNameRef: React.RefObject<HTMLDivElement | null>
}

export const useFileSave = ({ editor, fileName, initialContent, fileNameRef }: UseFileSaveProps) => {
  const { currentPath, setCurrentPath } = useSeriesStore()
  const { fetchTreeData } = useSeriesTreeStore()
  const { todayCharCount, setTodayCharCount } = useTodayCharCountStore()
  const [prevCharCount, setPrevCharCount] = useState(0)

  useEffect(() => {
    if (editor) {
      const initialCharCount = turndownService.turndown(initialContent).length
      setPrevCharCount(initialCharCount)
    }
  }, [editor, initialContent])

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

    fetchTreeData()
  }

  return { handleFileSave }
}
