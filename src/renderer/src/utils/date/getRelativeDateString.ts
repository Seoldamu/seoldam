const getRelativeDateString = (pastDate: Date | string): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const date = new Date(pastDate)
  date.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return ''

  if (diffDays < 7) {
    return `${diffDays === 0 ? 1 : diffDays}일`
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}주`
  }

  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}달`
  }

  const years = Math.floor(diffDays / 365)
  return `${years}년`
}

export default getRelativeDateString
