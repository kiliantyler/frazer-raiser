import type { Id } from '@convex/_generated/dataModel'

export type Update = {
  _id: Id<'updates'>
  title: string
  slug: string
  contentHtml?: string
  publishStatus: 'draft' | 'published'
  createdAt: number
  publishedAt?: number
  eventDate?: number
  imageIds: Id<'images'>[]
}

export type TimelineUpdate = {
  type: 'update'
  _id: Id<'updates'>
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: number
  createdAt: number
  eventDate?: number
  authorName: string
  authorAvatarUrl?: string
  heroImage: {
    _id: Id<'images'>
    url: string
    width: number
    height: number
  } | null
}

type TimelinePart = {
  type: 'part'
  _id: Id<'parts'>
  title: string
  priceCents: number
  date: number
  createdAt: number
  url?: string
  vendor?: string
  heroImage: {
    _id: Id<'images'>
    url: string
    width: number
    height: number
  } | null
}

export type TimelineItem = TimelineUpdate | TimelinePart
