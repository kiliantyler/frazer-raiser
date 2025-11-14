import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import Image from 'next/image'
import Link from 'next/link'

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function TimelinePage() {
  const entries = await fetchQuery(api.updates.listPublicForTimeline, {})

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          FROM BARN FIND TO SHOWROOM
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">The Restoration Journal</h1>
      </div>

      {entries.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No journal entries yet. Check back soon!</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-16" />

          <div className="space-y-12">
            {entries.map(entry => {
              const dateStr = formatDate(entry.publishedAt)
              const [month, day, year] = dateStr.split(' ')

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
                        <div className="mb-4 aspect-video overflow-hidden rounded-md">
                          <Image
                            src={entry.heroImage.url}
                            alt={entry.title}
                            width={entry.heroImage.width}
                            height={entry.heroImage.height}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        </div>
                      )}

                      <p className="text-muted-foreground leading-relaxed">{entry.excerpt}</p>

                      <div className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Read more →
                      </div>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}
