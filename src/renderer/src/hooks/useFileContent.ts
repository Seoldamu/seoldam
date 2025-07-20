import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { fileSystemService } from '@renderer/services/fileSystemService'
import { getDisplayFilePath } from '@renderer/utils'

const useFileContent = (currentPath: string | null) => {
  const [fileName, setFileName] = useState('')
  const [initialContent, setInitialContent] = useState('')

  useEffect(() => {
    const loadFileInfo = async () => {
      if (!currentPath) return

      const result = await fileSystemService.getFileInfo(currentPath)
      setFileName(getDisplayFilePath(result.fileName))

      const htmlContent = await marked.parse(result.content)
      setInitialContent(htmlContent)
    }

    loadFileInfo()
  }, [currentPath])

  return { fileName, setFileName, initialContent }
}

export default useFileContent
