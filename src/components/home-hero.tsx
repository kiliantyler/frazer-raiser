import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/kaiser.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-linear-to-b from-black/85 via-black/75 to-black/85" />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:py-48">
        <div className="max-w-3xl relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Wrenching in progress</span>
          </div>
          <h1 className="font-display text-balance text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl lg:text-8xl">
            Raising a Frazer
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] sm:text-xl">
            We&apos;re bringing a 1948 Frazer back to the road after decades asleep. If you&apos;re into old metal,
            stuck bolts, and small wins, you&apos;ll probably enjoy following along.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg" aria-label="Explore the timeline">
              <Link href="/timeline" className="inline-flex items-center gap-2">
                See the timeline
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-white/30 bg-black/40 px-8 text-base text-white backdrop-blur-md shadow-lg hover:bg-black/60 hover:border-white/40"
              aria-label="View gallery">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent"
      />
    </section>
  )
}
