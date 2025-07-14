export const countCharacters = (text: string): number => {
  return text.replace(/\s/g, '').length
}

export const diffCharacterCount = (prev: number, current: number): number => {
  return current - prev
}
