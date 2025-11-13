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
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Key Milestones</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            From disassembly to the final polish, track the major stages of this intricate restoration process.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MilestoneCard
            Icon={Search}
            title="Discovery & Teardown"
            description="Carefully documenting and disassembling the vehicle to assess its condition."
          />
          <MilestoneCard
            Icon={Hammer}
            title="Body & Chassis Work"
            description="Painstaking metalwork and structural repairs to bring the frame and body back to factory‑perfect form."
          />
          <MilestoneCard
            Icon={Cog}
            title="Mechanical Overhaul"
            description="Rebuilding the original engine, transmission, and drivetrain to ensure performance and reliability."
          />
          <MilestoneCard
            Icon={Sparkles}
            title="Paint & Final Assembly"
            description="Period‑correct finish, re‑installed chrome, and a fully reupholstered interior."
          />
        </div>
      </div>
    </section>
  )
}
