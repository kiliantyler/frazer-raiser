import { AboutIntroSection } from '@/components/public/about/about-intro-section'
import { FrazerDesignSection } from '@/components/public/about/frazer-design-section'
import { FrazerMechanicalSection } from '@/components/public/about/frazer-mechanical-section'
import { FrazerSpecsSection } from '@/components/public/about/frazer-specs-section'
import { KaiserFrazerSection } from '@/components/public/about/kaiser-frazer-section'
import { MyFrazerSection } from '@/components/public/about/my-frazer-section'
import { ChromeCard } from '@/components/shared/chrome-card'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        aria-label="About the Frazer restoration project"
        className="mx-auto max-w-3xl px-6 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <div className="mb-12 text-center sm:mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
            About the project
          </p>
          <h1 className="mt-3 font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            A 1948 Frazer, back from the quiet
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-sm text-pretty text-muted-foreground sm:text-base">
            Frazer Raiser is a long-form build journal for a 1948 Frazer that sat still for far too long. It is part
            documentation, part history lesson, and part motivation to keep turning wrenches.
          </p>
        </div>
        <ChromeCard className="mb-12">
          <div className="p-6 sm:p-8">
            <FrazerSpecsSection />
          </div>
        </ChromeCard>

        <div>
          <div className="prose prose-invert max-w-none text-sm leading-relaxed sm:text-base prose-headings:mt-8 prose-headings:mb-4 prose-p:text-muted-foreground prose-headings:font-display prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80">
            <AboutIntroSection />
            <KaiserFrazerSection />
            <FrazerDesignSection />
            <FrazerMechanicalSection />
            <MyFrazerSection />
          </div>
        </div>
      </section>
    </main>
  )
}
