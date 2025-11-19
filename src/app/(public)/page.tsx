import { AnimateOnView } from '@/components/home/animate-on-view'
import { HomeFeatures } from '@/components/home/home-features'
import { HomeGoals } from '@/components/home/home-goals'
import { HomeHero } from '@/components/home/home-hero'
import { HomeMilestones } from '@/components/home/home-milestones'
import { HomeStory } from '@/components/home/home-story'
import { BuildSheetHeader } from '@/components/public/home/build-sheet-header'
import { ChromeCard } from '@/components/shared/chrome-card'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <section aria-label="Frazer project overview" className="mx-auto max-w-5xl px-6 -mt-12 pb-20 sm:-mt-24 sm:pb-32">
        <ChromeCard>
          <BuildSheetHeader />
          <div className="divide-y divide-border/60">
            <AnimateOnView>
              <HomeStory />
            </AnimateOnView>
            <AnimateOnView>
              <HomeGoals />
            </AnimateOnView>
            <AnimateOnView>
              <HomeFeatures />
            </AnimateOnView>
            <AnimateOnView>
              <HomeMilestones />
            </AnimateOnView>
          </div>
        </ChromeCard>
      </section>
    </main>
  )
}
