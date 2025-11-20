import type { Id } from '@convex/_generated/dataModel'

export type WorkLogItem = {
  _id: Id<'workLogs'>
  date: number
  hours: number
  description?: string
  title: string
  tags?: string[]
  imageIds?: string[]
  costDeltaCents?: number
  author?: {
    name: string
    avatarUrl?: string
  }
  contributors?: { name: string; avatarUrl?: string }[]
  contributorIds?: Id<'contributors'>[]
}
