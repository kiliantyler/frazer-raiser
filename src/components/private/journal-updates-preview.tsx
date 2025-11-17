import { EmptyState } from '@/components/private/empty-state'
import type { JournalUpdate } from '@/types/updates'

export function JournalUpdatesPreview({ updates }: { updates: Array<JournalUpdate> }) {
  if (updates.length === 0) {
    return <EmptyState message="No journal entries yet" />
  }

  return (
    <div className="space-y-3">
      {updates.slice(0, 3).map(update => (
        <div key={update._id} className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{update.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(update.publishedAt ?? update.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
