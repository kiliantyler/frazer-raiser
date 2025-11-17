import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollIndicator } from './scroll-indicator'

export function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-5rem)] items-center overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/kaiser.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/75 to-black/85" />
      </div>
      <div className="mx-auto flex w-full max-w-7xl px-6 py-16 sm:py-24 lg:py-32">
        <div className="relative max-w-3xl">
          <h1 className="font-display text-balance text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl lg:text-8xl">
            Raising a <span className="font-frazer tracking-[0.35em] uppercase chrome-text">FRAZER</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] sm:text-xl">
            We&apos;re bringing a 1948 Frazer back to the road after decades asleep. If you&apos;re into old metal,
            stuck bolts, and small wins, you&apos;ll probably enjoy following along.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg" aria-label="Explore the updates">
              <Link href="/updates" className="inline-flex items-center gap-2">
                See the updates
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/30 bg-black/40 px-8 text-base text-white backdrop-blur-md shadow-lg hover:border-white/40 hover:bg-black/60"
              aria-label="View gallery">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-20 flex justify-center z-10 pb-2">
        <ScrollIndicator />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent"
      />
    </section>
  )
}
