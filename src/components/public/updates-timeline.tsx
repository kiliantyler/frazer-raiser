import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image'
import Link from 'next/link'

type TimelineUpdate = {
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

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function TimelineUpdatesList({ items }: { items: Array<TimelineUpdate> }) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No journal entries yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-16" />

      <div className="space-y-12">
        {items.map(entry => {
          const displayDate = entry.eventDate ?? entry.publishedAt
          const dateStr = formatDate(displayDate)
          const [month, day, year] = dateStr.split(' ')

          const authorInitials =
            entry.authorName
              .split(' ')
              .map(part => part[0])
              .join('')
              .slice(0, 2)
              .toUpperCase() || '?'

          return (
            <div key={entry._id} className="relative flex gap-8 md:gap-12">
              {/* Date on left */}
              <div className="flex-shrink-0 w-32 md:w-40 text-right">
                <div className="sticky top-24">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {month} {day}
                      </div>
                      <div className="text-sm font-medium text-foreground">{year}</div>
                    </div>
                    {/* Timeline marker */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card on right */}
              <div className="flex-1 pb-12">
                <Link
                  href={`/updates/${entry.slug}`}
                  className="group block rounded-lg border border-border/60 bg-card/60 p-6 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg">
                  <h2 className="mb-3 font-serif text-2xl font-bold transition-colors group-hover:text-primary sm:text-3xl">
                    {entry.title}
                  </h2>

                  {entry.heroImage && (
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-md">
                      <Image
                        src={entry.heroImage.url}
                        alt={entry.title}
                        fill
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </div>
                  )}

                  <p className="text-muted-foreground leading-relaxed">{entry.excerpt}</p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8" aria-label={`Author avatar for ${entry.authorName}`}>
                        {entry.authorAvatarUrl ? (
                          <AvatarImage src={entry.authorAvatarUrl} alt={entry.authorName} />
                        ) : (
                          <AvatarFallback>{authorInitials}</AvatarFallback>
                        )}
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">{entry.authorName}</span>
                    </div>

                    <div className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read more →
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
