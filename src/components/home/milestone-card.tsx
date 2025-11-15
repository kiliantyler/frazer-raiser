import { Card } from '@/components/ui/card'

interface MilestoneCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
}

export function MilestoneCard({ Icon, title, description }: MilestoneCardProps) {
  return (
    <Card className="group relative border-border/40 bg-card/50 p-6 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-md">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15 group-hover:ring-primary/20">
        <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold transition-colors group-hover:text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </Card>
  )
}
