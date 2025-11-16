import { TimelineEntry } from './timeline-entry'

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

export function TimelineUpdatesList({ items }: { items: Array<TimelineUpdate> }) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No journal entries yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Central timeline spine on desktop with gradient fade */}
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 md:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-border/60 to-transparent" />
      </div>

      <div className="space-y-16 md:space-y-20">
        {items.map((entry, index) => (
          <TimelineEntry key={entry._id} entry={entry} index={index} />
        ))}
      </div>
    </div>
  )
}
