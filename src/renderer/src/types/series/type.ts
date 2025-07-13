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
  path: string
}

export type SeriesListItem = Pick<
  SeriesMeta,
  'id' | 'title' | 'coverImagePath' | 'updatedAt' | 'path'
>

export type TreeNode = {
  id: string
  name: string
  type: 'file' | 'folder'
  path: string
  content?: string
  children?: TreeNode[]
}
