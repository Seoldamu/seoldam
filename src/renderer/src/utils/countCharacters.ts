const countCharacters = (text: string): number => {
  return text.replace(/\s/g, '').length
}

export default countCharacters
