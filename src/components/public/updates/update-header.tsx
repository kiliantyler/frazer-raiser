import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatLongDate, getAuthorInitials } from '@/lib/utils/format'

type UpdateHeaderProps = {
  title: string
  displayDate: number
  authorName: string
  authorAvatarUrl?: string
}

export function UpdateHeader({ title, displayDate, authorName, authorAvatarUrl }: UpdateHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="font-serif text-3xl font-bold sm:text-4xl">{title}</h1>
      <time dateTime={new Date(displayDate).toISOString()} className="mt-2 block text-sm text-muted-foreground">
        {formatLongDate(displayDate)}
      </time>
      <div className="mt-4 flex items-center gap-3">
        <Avatar className="size-9" aria-label={`Author avatar for ${authorName}`}>
          {authorAvatarUrl ? (
            <AvatarImage src={authorAvatarUrl} alt={authorName} />
          ) : (
            <AvatarFallback>{getAuthorInitials(authorName)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{authorName}</span>
          <span className="text-xs text-muted-foreground">Entry author</span>
        </div>
      </div>
    </header>
  )
}
