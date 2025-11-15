import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'

interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  href: string
  ariaLabel: string
}

export function FeatureCard({ Icon, title, description, href, ariaLabel }: FeatureCardProps) {
  return (
    <Card className="group relative h-full border-border/40 bg-card/50 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <CardContent className="p-6">
        <Link href={href as Route} aria-label={ariaLabel} className="block">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-2 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15 group-hover:ring-primary/20">
              <Icon className="size-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold transition-colors group-hover:text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-transform group-hover:gap-2">
                Learn more
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
