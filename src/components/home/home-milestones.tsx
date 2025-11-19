import { Cog, Hammer, Search, Sparkles } from 'lucide-react'

export function HomeMilestones() {
  return (
    <div className="w-full">
      <div className="mb-8 max-w-2xl">
        <p className="text-pretty text-muted-foreground">
          The major phases of the restoration process, from discovery to completion.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline border-b border-border/40 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Search className="size-4 text-primary" />
            Discovery & Teardown
          </div>
          <div className="text-sm text-muted-foreground">
            Pulling it apart, bagging and tagging, and figuring out what&apos;s good and what&apos;s not.
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline border-b border-border/40 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Hammer className="size-4 text-primary" />
            Body & Chassis Work
          </div>
          <div className="text-sm text-muted-foreground">
            Rust repair, metalwork, and getting the shell straight and solid.
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline border-b border-border/40 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Cog className="size-4 text-primary" />
            Mechanical Overhaul
          </div>
          <div className="text-sm text-muted-foreground">
            Brakes, fuel, wiring, engine - and everything that makes it move and stop.
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline border-b border-border/40 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="size-4 text-primary" />
            Paint & Final Assembly
          </div>
          <div className="text-sm text-muted-foreground">
            Paint, chrome, interior, and the satisfying puzzle of putting it all back together.
          </div>
        </div>
      </div>
    </div>
  )
}
