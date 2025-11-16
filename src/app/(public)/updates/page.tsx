import { UpdatesViewToggle } from '@/components/public/updates-view-toggle'
import { SectionFadeIn } from '@/components/shared/section-fade-in'
import { api } from '@convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { connection } from 'next/server'
import { Suspense } from 'react'

export default async function PublicUpdatesPage() {
  // Mark this route as dynamic for Next.js 16 so that libraries using randomness
  // internally (like Convex's client) don't trip the prerender-random check.
  await connection()

  const items = await fetchQuery(api.updates.listPublicForTimeline, {})

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
          <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading...</div>}>
            <UpdatesViewToggle items={items} />
          </Suspense>
        </SectionFadeIn>
      </section>
    </main>
  )
}
