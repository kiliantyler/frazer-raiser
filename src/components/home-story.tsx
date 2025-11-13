import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export function HomeStory() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">The Story</span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">How this started</h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              A friend gifted me a 1948 Frazer that had been tucked away in a barn for about twenty years. My dad and I
              drove 25 hours to pick it up and haul it back home. Dust on the dash, flat tires, and the smell of old
              fuel came with it.
            </p>
            <p>
              We winched it onto a trailer, checked the straps at every stop, and chased sunrise across a few states.
              Now we plan to make the most of it. Get it safe and reliable, keep its history intact, and do the hard
              parts right. Brakes, steering, fuel, ignition, wiring, then trim and comfort. The goal is simple: first
              start, first drive, first car show. We will share real numbers as we go, including time, parts, costs,
              mistakes, and fixes.
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xl">
          <Card className="group relative overflow-hidden border-border/40 bg-card/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
            <CardContent className="p-4">
              <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                <Image
                  src="/frazer-badge.jpg"
                  alt="Chrome hood ornament close-up"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority={false}
                  unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
