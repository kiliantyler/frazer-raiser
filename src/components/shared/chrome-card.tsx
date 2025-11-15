import { cn } from '@/lib/utils'

interface ChromeCardProps {
  children: React.ReactNode
  className?: string
  accentClassName?: string
}

export function ChromeCard({ children, className, accentClassName }: ChromeCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-sm',
        className,
      )}>
      <div
        className={cn(
          'chrome-accent pointer-events-none absolute left-4 right-4 -top-2 h-3 rounded-full',
          accentClassName,
        )}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
