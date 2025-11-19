import { Activity, BrushCleaning, Car, Home, Sparkles } from 'lucide-react'

// Easy to update: just change `done: false` to `done: true` for completed goals
const GOALS = [
  { Icon: Home, title: 'Bring It Home', done: true },
  { Icon: BrushCleaning, title: 'Cleaned out', done: false },
  { Icon: Activity, title: 'First Start', done: false },
  { Icon: Car, title: 'First Drive', done: false },
  { Icon: Sparkles, title: 'First Car Show', done: false },
]

export function HomeGoals() {
  return (
    <div className="w-full">
      <div className="mb-8 max-w-2xl">
        <p className="text-pretty text-muted-foreground">
          Our key objectives and what we&apos;re aiming to accomplish with this restoration.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {GOALS.map((goal, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 rounded-lg border border-border/40 bg-card/30 p-3 transition-colors hover:bg-primary/5 hover:border-primary/20">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-8 items-center justify-center rounded ${
                  goal.done ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                <goal.Icon className="size-4" />
              </div>
              <span className={`text-sm font-medium ${goal.done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {goal.title}
              </span>
            </div>
            <div
              className={`font-mono text-[10px] uppercase tracking-wider ${
                goal.done ? 'text-primary' : 'text-muted-foreground/60'
              }`}>
              [{goal.done ? 'COMPLETE' : 'PENDING'}]
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
