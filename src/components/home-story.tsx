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
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">The Story of a Time Capsule</h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Discovered after decades of slumber, this 1948 Frazer Manhattan is more than just a car; it&apos;s a
              preserved piece of American history. Our mission is to meticulously restore every detail, from the iconic
              chrome grille to the straight-six engine, preserving its heritage while preparing it for a new chapter on
              the open road.
            </p>
            <p>
              This project is a testament to timeless design and enduring craftsmanship. We invite you to follow along
              as we combine historical accuracy with modern techniques to give this automotive icon a second life.
            </p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xl">
          <Card className="group relative overflow-hidden border-border/40 bg-card/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
            <CardContent className="p-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/frazer-badge.jpg"
                  alt="Chrome hood ornament close-up"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority={false}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
