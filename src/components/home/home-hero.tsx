import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollIndicator } from './scroll-indicator'

export function HomeHero() {
  return (
    <section className="relative isolate flex h-dvh items-center overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/kaiser.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/75 to-black/85" />
      </div>
      <div className="mx-auto flex w-full max-w-7xl px-6 py-16 sm:py-24 lg:py-32">
        <div className="relative max-w-3xl">
          <h1 className="font-display text-balance text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
            Raising a{' '}
            <span className="font-frazer tracking-[0.2em] uppercase chrome-text" data-text="FRAZER">
              FRAZER
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg font-medium leading-relaxed text-white/90 drop-shadow-md sm:text-xl/8">
            We&apos;re bringing a 1948 Frazer back to the road after decades asleep. If you&apos;re into old metal,
            stuck bolts, and small wins, you&apos;ll probably enjoy following along.
          </p>
          <div className="mt-12 flex flex-col gap-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 text-lg font-semibold shadow-xl transition-transform hover:scale-105"
              aria-label="Explore the updates">
              <Link href="/updates" className="inline-flex items-center gap-2">
                See the updates
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 border-white/20 bg-white/5 px-10 text-lg font-semibold text-white backdrop-blur-md shadow-xl transition-all hover:bg-white/10 hover:border-white/40 hover:scale-105"
              aria-label="View gallery">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center justify-center gap-2 z-10 pb-2">
        <span className="text-xs font-medium uppercase tracking-widest text-white/80 animate-pulse">
          Scroll for more
        </span>
        <ScrollIndicator />
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent"
      />
      <div className="absolute bottom-4 right-6 z-20">
        <p className="text-[10px] font-medium uppercase tracking-widest text-white/20">*1947 Kaiser pictured</p>
      </div>
    </section>
  )
}
