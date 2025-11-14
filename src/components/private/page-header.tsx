import { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-serif text-2xl">{title}</h1>
        {action}
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}

