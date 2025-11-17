import type { PartListItem, StatusFilter } from '@/types/parts'

export function getPartStatus(part: PartListItem): StatusFilter {
  // Backward compatibility for older parts with no status
  return (part.status ?? (part.installedOn ? 'installed' : 'ordered')) as StatusFilter
}
