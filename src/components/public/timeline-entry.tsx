import { TimelineDateMarker } from '@/components/public/timeline/timeline-date-marker'
import { TimelineHeroImage } from '@/components/public/timeline/timeline-hero-image'
import { TimelinePartContent } from '@/components/public/timeline/timeline-part-content'
import { TimelineTextContent } from '@/components/public/timeline/timeline-text-content'
import { formatLongDate, getAuthorInitials } from '@/lib/utils/format'
import type { TimelineItem } from '@/types/updates'
import { Wrench } from 'lucide-react'
import Link from 'next/link'

export function TimelineEntry({ entry }: { entry: TimelineItem; index: number }) {
  const displayDate = entry.type === 'update' ? (entry.eventDate ?? entry.publishedAt) : entry.date
  const dateStr = formatLongDate(displayDate)

  // Render logic for regular updates
  if (entry.type === 'update') {
    const authorInitials = getAuthorInitials(entry.authorName)
    return (
      <div className="relative">
        {/* Mobile Date (above content) */}
        <div className="mb-2 pl-12 md:hidden">
          <span className="text-xs font-medium text-muted-foreground">{dateStr}</span>
        </div>

        {/* Desktop Date (left column) */}
        <div className="absolute left-4 top-8 hidden -translate-x-full pr-8 md:block md:left-32 md:w-32">
          <TimelineDateMarker dateStr={dateStr} />
        </div>

        {/* Dot on spine */}
        <div className="absolute left-4 top-8 size-2.5 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-sm md:left-32" />

        <Link href={`/updates/${entry.slug}`} className="group block pl-12 md:pl-44">
          <div className="space-y-6">
            <TimelineHeroImage image={entry.heroImage} alt={entry.title} />

            <div className="md:pr-10">
              <TimelineTextContent
                title={entry.title}
                excerpt={entry.excerpt}
                authorName={entry.authorName}
                authorAvatarUrl={entry.authorAvatarUrl}
                authorInitials={authorInitials}
              />
            </div>
          </div>
        </Link>
      </div>
    )
  }

  // Render logic for parts
  return (
    <div className="relative">
      {/* Mobile Date (above content) */}
      <div className="mb-2 pl-12 md:hidden">
        <span className="text-xs font-medium text-muted-foreground">{dateStr}</span>
      </div>

      {/* Desktop Date (left column) */}
      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 -translate-x-full pr-8 md:block md:left-32 md:w-32">
        <TimelineDateMarker dateStr={dateStr} />
      </div>

      {/* Dot on spine (wrench icon for parts?) */}
      <div className="absolute left-4 top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-sm md:left-32">
        <Wrench className="size-3 text-muted-foreground" />
      </div>

      <div className="pl-12 md:pl-44">
        <div className="max-w-md">
          <TimelinePartContent title={entry.title} priceCents={entry.priceCents} vendor={entry.vendor} />
        </div>
      </div>
    </div>
  )
}
