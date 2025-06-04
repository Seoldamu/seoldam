export type SeriesMeta = {
  id: string
  title: string
  description: string
  coverImagePath: string
  author: string
  createdAt: string
  updatedAt: string
  genres: string[]
  tags: string[]
  status: string
  charCounts: []
}

export type SeriesListItem = Pick<SeriesMeta, 'id' | 'title' | 'coverImagePath' | 'updatedAt'>
