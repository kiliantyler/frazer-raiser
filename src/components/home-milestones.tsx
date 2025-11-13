import { Cog, Hammer, Search, Sparkles } from 'lucide-react'
import { MilestoneCard } from './milestone-card'

export function HomeMilestones() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Process</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Milestones</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            From the first teardown bolts to final polish—these are the big steps.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MilestoneCard
            Icon={Search}
            title="Discovery & Teardown"
            description="Pulling it apart, bagging and tagging, and figuring out what's good and what's not."
          />
          <MilestoneCard
            Icon={Hammer}
            title="Body & Chassis Work"
            description="Rust repair, metalwork, and getting the shell straight and solid."
          />
          <MilestoneCard
            Icon={Cog}
            title="Mechanical Overhaul"
            description="Brakes, fuel, wiring, engine—and everything that makes it move and stop."
          />
          <MilestoneCard
            Icon={Sparkles}
            title="Paint & Final Assembly"
            description="Paint, chrome, interior, and the satisfying puzzle of putting it all back together."
          />
        </div>
      </div>
    </section>
  )
}
