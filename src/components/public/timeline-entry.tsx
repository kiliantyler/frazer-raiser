import { TimelineDateMarker } from '@/components/public/timeline/timeline-date-marker'
import { TimelineHeroImage } from '@/components/public/timeline/timeline-hero-image'
import { TimelineTextContent } from '@/components/public/timeline/timeline-text-content'
import { formatLongDate, getAuthorInitials } from '@/lib/utils/format'
import type { TimelineUpdate } from '@/types/updates'
import Link from 'next/link'

export function TimelineEntry({ entry, index }: { entry: TimelineUpdate; index: number }) {
  const displayDate = entry.eventDate ?? entry.publishedAt
  const dateStr = formatLongDate(displayDate)
  const authorInitials = getAuthorInitials(entry.authorName)
  const isLeft = index % 2 === 0

  return (
    <div className="relative py-8 md:py-12">
      <TimelineDateMarker dateStr={dateStr} />

      {/* Horizontal connector from spine to content (desktop) */}
      <div
        className={`pointer-events-none absolute top-12 left-1/2 hidden h-px w-[calc(50%-2rem)] -translate-x-1/2 md:block ${
          isLeft
            ? 'bg-gradient-to-l from-border/50 via-border/30 to-transparent'
            : 'bg-gradient-to-r from-transparent via-border/30 to-border/50'
        }`}
      />

      <Link href={`/updates/${entry.slug}`} className="group block">
        {/* Mobile: stack image then text */}
        <div className="space-y-5 md:hidden">
          <TimelineHeroImage image={entry.heroImage} alt={entry.title} />
          <div className="rounded-2xl border border-border/50 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
            <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{dateStr}</div>
            <TimelineTextContent
              title={entry.title}
              excerpt={entry.excerpt}
              authorName={entry.authorName}
              authorAvatarUrl={entry.authorAvatarUrl}
              authorInitials={authorInitials}
            />
          </div>
        </div>

        {/* Desktop: hero on one side, text on the other, alternating */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-12 md:items-center">
          {isLeft ? (
            <>
              <div className="flex flex-col justify-center pr-10">
                <TimelineTextContent
                  title={entry.title}
                  excerpt={entry.excerpt}
                  authorName={entry.authorName}
                  authorAvatarUrl={entry.authorAvatarUrl}
                  authorInitials={authorInitials}
                />
              </div>
              <div className="transition-transform duration-500 group-hover:scale-[1.02]">
                <TimelineHeroImage image={entry.heroImage} alt={entry.title} />
              </div>
            </>
          ) : (
            <>
              <div className="transition-transform duration-500 group-hover:scale-[1.02]">
                <TimelineHeroImage image={entry.heroImage} alt={entry.title} />
              </div>
              <div className="flex flex-col justify-center pl-10">
                <TimelineTextContent
                  title={entry.title}
                  excerpt={entry.excerpt}
                  authorName={entry.authorName}
                  authorAvatarUrl={entry.authorAvatarUrl}
                  authorInitials={authorInitials}
                />
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  )
}
