import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type TimelineTextContentProps = {
  title: string
  excerpt: string
  authorName: string
  authorAvatarUrl?: string
  authorInitials: string
}

export function TimelineTextContent({
  title,
  excerpt,
  authorName,
  authorAvatarUrl,
  authorInitials,
}: TimelineTextContentProps) {
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
