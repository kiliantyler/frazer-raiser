import { UpdatesViewToggle } from '@/components/public/updates-view-toggle'
import { UpdatesViewControls } from '@/components/public/updates/updates-view-controls'
import { SectionFadeIn } from '@/components/shared/section-fade-in'
import { getUpdates } from '@/lib/data/updates'
import { Rss } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata: Metadata = {
  alternates: {
    types: {
      'application/rss+xml': '/api/rss',
    },
  },
}

export default async function PublicUpdatesPage() {
  const items = await getUpdates()

  return (
    <main className="relative mx-auto max-w-5xl px-6 py-12">
      <div className="absolute right-6 top-12 flex items-center gap-3">
        <UpdatesViewControls />
        <Link
          href="/api/rss"
          className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Subscribe to RSS feed"
          title="RSS Feed">
          <Rss className="size-3.5" />
          <span className="hidden sm:inline">RSS</span>
        </Link>
      </div>
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
