import { EmptyState } from '@/components/private/empty-state'
import type { TimelineUpdate } from '@/types/updates'

export function JournalUpdatesPreview({ updates }: { updates: Array<TimelineUpdate> }) {
  if (updates.length === 0) {
    return <EmptyState message="No journal entries yet" />
  }

  return (
    <div className="space-y-3">
      {updates.slice(0, 3).map(update => {
        // Use eventDate if available and valid, otherwise fall back to publishedAt or createdAt
        let displayDate = update.eventDate ?? update.publishedAt ?? update.createdAt
        let date = new Date(displayDate)

        // If eventDate is invalid, try fallback dates
        if (update.eventDate && Number.isNaN(date.getTime())) {
          displayDate = update.publishedAt ?? update.createdAt
          date = new Date(displayDate)
        }

        // Format the date, ensuring it's valid
        const formattedDate = Number.isNaN(date.getTime())
          ? new Date(update.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })

        return (
          <div key={update._id} className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{update.title}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
