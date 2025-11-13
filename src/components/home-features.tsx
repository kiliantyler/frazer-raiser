import { Cog, Image as ImageIcon, Newspaper } from 'lucide-react'
import { FeatureCard } from './feature-card'

export function HomeFeatures() {
  return (
    <section aria-label="Explore more" className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Explore the Journey</h2>
          <p className="mt-4 text-muted-foreground">
            Discover detailed documentation of every stage of this remarkable restoration project.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            Icon={Newspaper}
            title="Latest updates"
            description="Progress notes, parts arrivals, and milestone write‑ups."
            href="/updates"
            ariaLabel="Browse latest updates"
          />
          <FeatureCard
            Icon={ImageIcon}
            title="Photo gallery"
            description="High‑resolution photo sets documenting key stages."
            href="/gallery"
            ariaLabel="Open gallery"
          />
          <FeatureCard
            Icon={Cog}
            title="About the project"
            description="The car's history and what this restoration aims to preserve."
            href="/about"
            ariaLabel="Read about the project"
          />
        </div>
      </div>
    </section>
  )
}
