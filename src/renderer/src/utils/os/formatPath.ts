export const joinPath = (...parts: string[]) => {
  return parts
    .map((p) => p.trim().replace(/\\/g, '/'))
    .map((p) => p.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
}

export const getDisplayFilePath = (name: string) => name.replace(/\.md$/, '')

export const getRealFilePath = (name: string) => (name.endsWith('.md') ? name : `${name}.md`)

export const getDirname = (path: string) => {
  const parts = path.split(/[\\/]/)
  parts.pop()
  return parts.join('/')
}

export const getBasename = (filePath: string): string => {
  if (!filePath) return ''

  const parts = filePath.split(/[\\/]/)
  return parts[parts.length - 1] || ''
}

export const getBasenameWithoutExt = (filePath: string): string => {
  const basename = getBasename(filePath)
  const lastDotIndex = basename.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return basename
  }

  return basename.substring(0, lastDotIndex)
}
