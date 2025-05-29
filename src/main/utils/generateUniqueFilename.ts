const generateUniqueFilename = (ext: string): string => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '')

  const random = Math.random().toString(36).substring(2, 8)
  return `cover_${date}_${time}_${random}.${ext}`
}

export default generateUniqueFilename
