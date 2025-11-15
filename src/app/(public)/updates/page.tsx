import { SectionFadeIn } from '@/components/shared/section-fade-in'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import Link from 'next/link'
import { connection } from 'next/server'

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function PublicUpdatesPage() {
  // Mark this route as dynamic for Next.js 16 so that libraries using randomness
  // internally (like Convex's client) don't trip the prerender-random check.
  await connection()

  const items = await fetchQuery(api.updates.listPublic, {})

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section aria-label="Project journal updates">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            Journal & updates
          </p>
          <h1 className="mt-3 font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Follow along with the build
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
            Progress notes, parts arrivals, small wins, and occasional setbacks as the Frazer slowly comes back to life.
          </p>
        </div>

        <SectionFadeIn delayMs={80}>
          {items.length === 0 ? (
            <div className="py-10 text-center sm:py-12">
              <p className="text-sm text-muted-foreground sm:text-base">
                No updates yet. Once the wrenches start turning, this is where the story will unfold.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(item => {
                const displayDate = item.eventDate
                  ? formatDate(item.eventDate)
                  : item.publishedAt
                    ? formatDate(item.publishedAt)
                    : formatDate(item.createdAt)

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
                      <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0 text-xs text-muted-foreground sm:text-sm">
                        <span>{displayDate}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary sm:text-xs">
                          Read entry
                          <span
                            aria-hidden="true"
                            className="translate-y-[0.5px] transition-transform group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </SectionFadeIn>
      </section>
    </main>
  )
}
