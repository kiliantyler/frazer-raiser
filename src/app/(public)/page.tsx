import { HomeFeatures } from '@/components/home/home-features'
import { HomeGoals } from '@/components/home/home-goals'
import { HomeHero } from '@/components/home/home-hero'
import { HomeMilestones } from '@/components/home/home-milestones'
import { HomeStory } from '@/components/home/home-story'
import { SpecRow } from '@/components/home/spec-row'
import { BuildSheetHeader } from '@/components/public/home/build-sheet-header'
import { ChromeCard } from '@/components/shared/chrome-card'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <section aria-label="Frazer project overview" className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
        <ChromeCard>
          <BuildSheetHeader />
          <div className="flex flex-col">
            <SpecRow label="01. The Story">
              <HomeStory />
            </SpecRow>
            <SpecRow label="02. Objectives">
              <HomeGoals />
            </SpecRow>
            <SpecRow label="03. Milestones">
              <HomeMilestones />
            </SpecRow>
            <SpecRow label="04. Follow Along" last>
              <HomeFeatures />
            </SpecRow>
          </div>
        </ChromeCard>
      </section>
    </main>
  )
}
