export type Update = {
  _id: string
  title: string
  slug: string
  contentHtml?: string
  publishStatus: 'draft' | 'published'
  createdAt: number
  publishedAt?: number
  eventDate?: number
  imageIds: string[]
}

export type TimelineUpdate = {
  _id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: number
  createdAt: number
  eventDate?: number
  authorName: string
  authorAvatarUrl?: string
  heroImage: {
    _id: string
    url: string
    width: number
    height: number
  } | null
}
