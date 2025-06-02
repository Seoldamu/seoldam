const generateSeriesId = (): string => {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

export default generateSeriesId
//TODO: 충돌 위험 낮지만 존재. 있는 id일 경우 처리 로직 추가
