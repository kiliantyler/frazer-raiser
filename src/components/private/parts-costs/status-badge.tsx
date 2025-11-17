import { Badge } from '@/components/ui/badge'
import type { StatusFilter } from '@/types/parts'

export function StatusBadge({ status }: { status: StatusFilter }) {
  const safeStatus = (status ?? 'ordered') as Exclude<StatusFilter, 'all'>
  const variants: Record<Exclude<StatusFilter, 'all'>, string> = {
    ordered: 'bg-sky-700/90 text-white border-sky-800',
    shipped: 'bg-amber-600/90 text-white border-amber-700',
    received: 'bg-indigo-600/90 text-white border-indigo-700',
    installed: 'bg-emerald-600/90 text-white border-emerald-700',
    cancelled: 'bg-zinc-600/90 text-white border-zinc-700',
  }
  const label = safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)
  return <Badge className={variants[safeStatus]}>{label}</Badge>
}
