import { HomeFeatures } from '@/components/home-features'
import { HomeFooter } from '@/components/home-footer'
import { HomeHero } from '@/components/home-hero'
import { HomeMilestones } from '@/components/home-milestones'
import { HomeStory } from '@/components/home-story'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHero />
      <HomeStory />
      <HomeFeatures />
      <HomeMilestones />
      <HomeFooter />
    </main>
  )
}
