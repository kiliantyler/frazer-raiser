import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Route } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

export function SectionCard({
  title,
  viewAllHref,
  children,
  className,
}: {
  title: string
  viewAllHref?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={`border-border/40 bg-card ${className ?? ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {viewAllHref && (
          <Link href={viewAllHref as Route} className="text-sm text-muted-foreground hover:text-foreground">
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
