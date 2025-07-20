import { Editor } from '@tiptap/react'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { useSeriesStore, useSeriesTreeStore, useTodayCharCountStore } from '@renderer/stores'
import TurndownService from 'turndown'
import { useEffect, useState } from 'react'
import { useToast } from '@renderer/hooks'

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

export const useFileSave = ({
  editor,
  fileName,
  initialContent,
  fileNameRef
}: UseFileSaveProps) => {
  const { currentPath, setCurrentPath } = useSeriesStore()
  const { fetchTreeData } = useSeriesTreeStore()
  const { todayCharCount, setTodayCharCount } = useTodayCharCountStore()
  const [prevCharCount, setPrevCharCount] = useState(0)

  const toast = useToast()

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
        toast('ERROR', '파일명 변경에 실패했습니다')
        return
      }
      pathToSave = renameResult.path
      setCurrentPath(pathToSave)
    }

    const saveResult = await fileSystemService.saveFile(pathToSave, markdownText)
    if (!saveResult.success) {
      toast('ERROR', '파일 저장에 실패했습니다')
      return
    }
    toast('SUCCESS', '파일이 성공적으로 저장되었습니다')

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
