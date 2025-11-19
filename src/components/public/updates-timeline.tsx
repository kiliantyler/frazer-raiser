import type { TimelineItem } from '@/types/updates'
import { TimelineEntry } from './timeline-entry'

export function TimelineUpdatesList({ items }: { items: Array<TimelineItem> }) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">No journal entries yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Timeline spine */}
      <div className="pointer-events-none absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/60 to-transparent md:left-32" />

      <div className="space-y-12 md:space-y-16">
        {items.map((entry, index) => (
          <TimelineEntry key={entry._id} entry={entry} index={index} />
        ))}
      </div>
    </div>
  )
}
