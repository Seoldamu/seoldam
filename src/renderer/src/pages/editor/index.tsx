import { FileEditor, FolderEditor } from '@renderer/components/editor'
import { useSeriesStore } from '@renderer/stores'
import { useMemo } from 'react'

const Editor = () => {
  const { currentPath } = useSeriesStore()

  // TODO: 정확한 파일 및 폴더 판단 로직 구현
  const isFolder = useMemo(() => {
    if (!currentPath) return false
    return !currentPath.endsWith('.md')
  }, [currentPath])

  if (!currentPath) {
    return null
  }

  return <div>{isFolder ? <FolderEditor /> : <FileEditor />}</div>
}

export default Editor
