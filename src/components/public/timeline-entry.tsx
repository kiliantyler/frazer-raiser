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

function getAuthorInitials(name: string): string {
  return (
    name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  )
}

function TimelineHeroImage({ image, alt }: { image: { url: string } | null; alt: string }) {
  if (!image) return null

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-lg">
      <Image
        src={image.url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
    </div>
  )
}

function TimelineTextContent({
  title,
  excerpt,
  authorName,
  authorAvatarUrl,
  authorInitials,
}: {
  title: string
  excerpt: string
  authorName: string
  authorAvatarUrl?: string
  authorInitials: string
}) {
  return (
    <>
      <h2 className="mb-4 font-serif text-xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl md:text-[1.75rem] md:leading-tight">
        {title}
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-relaxed">{excerpt}</p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar
            className="size-9 ring-2 ring-background transition-all group-hover:ring-primary/20"
            aria-label={`Author avatar for ${authorName}`}>
            {authorAvatarUrl ? (
              <AvatarImage src={authorAvatarUrl} alt={authorName} />
            ) : (
              <AvatarFallback className="bg-muted text-muted-foreground">{authorInitials}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{authorName}</span>
            <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:inline">
              Entry author
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-all group-hover:gap-2">
          Read entry
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </>
  )
}

function TimelineDateMarker({ dateStr }: { dateStr: string }) {
  const [month, day, year] = dateStr.split(' ')

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 flex-col items-center md:flex">
      <div className="rounded-lg border border-border/50 bg-background/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
          {month} {day}
        </span>
        <span className="block text-center text-[10px] text-muted-foreground">{year}</span>
      </div>
      <div className="relative mt-2">
        <div className="absolute inset-0 h-4 w-4 rounded-full bg-primary/20 blur-sm" />
        <div className="relative h-3 w-3 rounded-full bg-primary ring-4 ring-background shadow-sm" />
      </div>
    </div>
  )
}

export function TimelineEntry({ entry, index }: { entry: TimelineUpdate; index: number }) {
  const displayDate = entry.eventDate ?? entry.publishedAt
  const dateStr = formatDate(displayDate)
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
