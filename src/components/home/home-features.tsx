import { SectionFadeIn } from '@/components/shared/section-fade-in'
import { Cog, Image as ImageIcon, Newspaper } from 'lucide-react'
import { FeatureCard } from './feature-card'

export function HomeFeatures() {
  return (
    <section aria-label="Explore more" className="px-6 py-10 sm:px-10 sm:py-12">
      <div className="mx-auto w-full">
        <SectionFadeIn delayMs={120}>
          <div className="mb-8 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold uppercase text-primary font-frazer tracking-widest">Follow Along</h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              I&apos;m documenting every step. See the wins, the mistakes, and everything in between.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              Icon={Newspaper}
              title="Latest updates"
              description="Progress notes, parts that showed up, and what's next."
              href="/updates"
              ariaLabel="Browse latest updates"
            />
            <FeatureCard
              Icon={ImageIcon}
              title="Photo gallery"
              description="Photos from the shop—before, during, and after."
              href="/gallery"
              ariaLabel="Open gallery"
            />
            <FeatureCard
              Icon={Cog}
              title="About the project"
              description="Why this car, a bit of history, and how I'm approaching the build."
              href="/about"
              ariaLabel="Read about the project"
            />
          </div>
        </SectionFadeIn>
      </div>
    </section>
  )
}
