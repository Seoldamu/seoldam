const joinPath = (...parts: string[]) => {
  return parts
    .map((p) => p.trim().replace(/\\/g, '/'))
    .map((p) => p.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/')
}

export default joinPath
