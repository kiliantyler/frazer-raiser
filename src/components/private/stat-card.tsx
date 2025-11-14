import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StatCard({
  title,
  value,
  valueClassName,
}: {
  title: string
  value: string | number
  valueClassName?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${valueClassName ?? ''}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

