export type PartStatus = 'ordered' | 'shipped' | 'received' | 'installed' | 'cancelled'

export type StatusFilter = 'all' | PartStatus

export type PartListItem = {
  _id: string
  name: string
  vendor?: string
  supplierName?: string
  supplierId?: string
  partNumber?: string
  status?: PartStatus
  priceCents: number
  quantity?: number
  purchasedOn?: number
  installedOn?: number
  sourceUrl?: string
  linkedTaskId?: string
}

export type Part = {
  _id: string
  name: string
  vendor?: string
  supplierId?: string
  partNumber?: string
  status?: PartStatus
  priceCents: number
  quantity?: number
  purchasedOn?: number
  installedOn?: number
  notes?: string
  sourceUrl?: string
  linkedTaskId?: string
}
