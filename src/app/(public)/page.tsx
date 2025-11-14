import { AnimateOnView } from '@/components/animate-on-view'
import { HomeFeatures } from '@/components/home-features'
import { HomeFooter } from '@/components/home-footer'
import { HomeGoals } from '@/components/home-goals'
import { HomeHero } from '@/components/home-hero'
import { HomeMilestones } from '@/components/home-milestones'
import { HomeStory } from '@/components/home-story'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <section aria-label="Frazer project overview" className="mx-auto max-w-5xl px-6 -mt-10 pb-16 sm:-mt-16 sm:pb-24">
        <div className="rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm">
          <div className="chrome-accent h-1.5 w-full rounded-t-3xl border-b border-border/60" />
          <header className="flex items-center justify-between px-6 pb-4 pt-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            <span>Frazer build sheet</span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <span className="inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
              Live project
            </span>
          </header>
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
        </div>
      </section>
      <HomeFooter />
    </main>
  )
}
