import { Card } from '@/components/ui/card'
import { Activity, Car, CheckCircle2, Sparkles, Zap } from 'lucide-react'

interface GoalCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  done: boolean
}
// Easy to update: just change `done: false` to `done: true` for completed goals
const GOALS = [
  { Icon: Zap, title: 'First Start', done: false },
  { Icon: Activity, title: 'First Run', done: false },
  { Icon: Car, title: 'First Drive', done: false },
  { Icon: Sparkles, title: 'First Car Show', done: false },
]

function GoalCard({ Icon, title, done }: GoalCardProps) {
  return (
    <Card
      className={`group relative border-border/40 bg-card/50 p-6 text-center shadow-sm transition-all duration-300 ${
        done
          ? 'overflow-hidden border-primary/30 bg-primary/5'
          : 'overflow-hidden hover:border-primary/30 hover:bg-card/70 hover:shadow-md'
      }`}>
      {done && (
        <div className="pointer-events-none absolute right-0 top-0 z-20 h-16 w-16 overflow-hidden">
          <div
            className="absolute bg-primary text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground text-center shadow-md"
            style={{
              width: '120px',
              padding: '4px 0',
              top: '12px',
              right: '-36px',
              transform: 'rotate(45deg)',
            }}>
            Done
          </div>
        </div>
      )}
      <div
        className={`mx-auto flex size-14 items-center justify-center rounded-full transition-all duration-300 ${
          done
            ? 'bg-primary/20 text-primary ring-2 ring-primary/20'
            : 'bg-primary/10 text-primary ring-2 ring-primary/10 group-hover:scale-110 group-hover:bg-primary/15 group-hover:ring-primary/20'
        }`}>
        {done ? (
          <CheckCircle2 className="size-6" aria-hidden="true" />
        ) : (
          <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
        )}
      </div>
      <h3
        className={`mt-5 font-display text-lg font-semibold transition-colors ${
          done ? 'text-muted-foreground line-through' : 'group-hover:text-primary'
        }`}>
        {title}
      </h3>
    </Card>
  )
}

export function HomeGoals() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">The Plan</span>
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Goals</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">The milestones we&apos;re working toward.</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((goal, index) => (
            <div key={index} className="overflow-visible">
              <GoalCard Icon={goal.Icon} title={goal.title} done={goal.done} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
