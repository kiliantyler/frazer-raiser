import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatLongDate, getAuthorInitials } from '@/lib/utils/format'
import Link from 'next/link'
import { type TimelineUpdate } from './updates-timeline'

export function GridUpdatesList({ items }: { items: Array<TimelineUpdate> }) {
  if (items.length === 0) {
    return (
      <div className="py-10 text-center sm:py-12">
        <p className="text-sm text-muted-foreground sm:text-base">
          No updates yet. Once the wrenches start turning, this is where the story will unfold.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => {
        const displayDate = item.eventDate
          ? formatLongDate(item.eventDate)
          : item.publishedAt
            ? formatLongDate(item.publishedAt)
            : formatLongDate(item.createdAt)

        const authorInitials = getAuthorInitials(item.authorName)

        return (
          <Link
            key={item._id}
            href={`/updates/${item.slug}`}
            aria-label={`Read update: ${item.title}`}
            className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl border-border/60 bg-linear-to-b from-background/70 via-background/60 to-background/40 shadow-sm transition-transform transition-shadow duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base font-semibold leading-snug tracking-tight sm:text-lg">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto space-y-3 pt-0 text-xs text-muted-foreground sm:text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span>{displayDate}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary sm:text-xs">
                    Read entry
                    <span
                      aria-hidden="true"
                      className="translate-y-[0.5px] transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="size-7" aria-label={`Author avatar for ${item.authorName}`}>
                    {item.authorAvatarUrl ? (
                      <AvatarImage src={item.authorAvatarUrl} alt={item.authorName} />
                    ) : (
                      <AvatarFallback>{authorInitials}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-xs font-medium text-foreground sm:text-sm">{item.authorName}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
