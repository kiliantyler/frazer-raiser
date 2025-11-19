import { cn } from '@/lib/utils'

interface SpecRowProps {
  label: string
  children: React.ReactNode
  className?: string
  last?: boolean
}

export function SpecRow({ label, children, className, last = false }: SpecRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]',
        !last && 'border-b border-border/60',
      )}>
      <div className="border-b border-border/60 md:border-b-0 md:border-r px-6 py-4 md:py-8 lg:py-10">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/80 sticky top-4">
          {label}
        </h3>
      </div>
      <div className={cn('px-6 py-6 md:py-8 lg:py-10', className)}>{children}</div>
    </div>
  )
}
