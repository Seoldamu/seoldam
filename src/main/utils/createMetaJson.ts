import generateSeriesId from './generateSeriesId'

const createMetaJson = (seriesName: string, coverImagePath: string) => {
  const now = new Date().toISOString()

  const meta = {
    id: generateSeriesId(),
    title: seriesName,
    description: '',
    coverImagePath: coverImagePath,
    author: '',
    createdAt: now,
    updatedAt: now,
    genres: [],
    tags: [],
    status: '',
    charCounts: []
  }

  return meta
}

export default createMetaJson
