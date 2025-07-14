import { EditorRoot, FileEditor } from '@renderer/components/editor'
import { useSeriesStore } from '@renderer/stores'
import { useMemo } from 'react'

const Editor = () => {
  const { currentPath } = useSeriesStore()

  // TODO: 정확한 파일 및 폴더 판단 로직 구현
  const isFolder = useMemo(() => {
    if (!currentPath) return false
    const hasExtension = /\.[^/.]+$/.test(currentPath)
    return !hasExtension
  }, [currentPath])

  if (!currentPath) {
    return null
  }

  return <div>{isFolder ? <EditorRoot /> : <FileEditor />}</div>
}

export default Editor
