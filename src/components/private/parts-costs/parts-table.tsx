'use client'

import { setPartStatusAction } from '@/app/(private)/parts-costs/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/format'
import { getPartStatus } from '@/lib/utils/parts'
import type { PartListItem, StatusFilter } from '@/types/parts'
import type { Supplier } from '@/types/suppliers'
import { Car, Search as SearchIcon } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { DeletePartDialog } from './delete-part-dialog'
import { PartDialog } from './part-dialog'
import { StatusBadge } from './status-badge'

export function PartsTable({ parts, suppliers }: { parts: Array<PartListItem>; suppliers: Array<Supplier> }) {
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<StatusFilter>('all')
  const [page, setPage] = React.useState(1)
  const pageSize = 5

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const byText = q
      ? parts.filter(p => {
          const name = p.name?.toLowerCase() ?? ''
          const vendor = p.vendor?.toLowerCase() ?? ''
          const supplier = p.supplierName?.toLowerCase() ?? ''
          const pn = p.partNumber?.toLowerCase() ?? ''
          return name.includes(q) || vendor.includes(q) || supplier.includes(q) || pn.includes(q)
        })
      : parts
    const byStatus = status === 'all' ? byText : byText.filter(p => getPartStatus(p) === status)
    return byStatus
  }, [parts, query, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  React.useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1)
  }, [query, status])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search by part name, supplier"
            placeholder="Search by part name, supplier..."
            className="pl-8"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={v => setStatus(v as StatusFilter)}>
            <SelectTrigger aria-label="Filter by Status">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ordered">Ordered</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="installed">Installed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Name</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Part Number</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map(p => (
            <TableRow key={p._id}>
              <TableCell className="max-w-[340px]">
                <div className="flex items-center gap-2 truncate">
                  {p.isForCar && (
                    <Car className="size-4 shrink-0 text-muted-foreground" aria-label="Purchased for the car" />
                  )}
                  <span className="truncate">
                    {p.sourceUrl ? (
                      <Link
                        href={p.sourceUrl as Route}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:opacity-80">
                        {p.name}
                      </Link>
                    ) : (
                      p.name
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{p.supplierName ?? p.vendor ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground">{p.partNumber ?? '—'}</TableCell>
              <TableCell className="text-muted-foreground">{p.quantity ?? 1}</TableCell>
              <TableCell className="text-muted-foreground">
                {p.purchasedOn ? new Date(p.purchasedOn).toISOString().slice(0, 10) : '—'}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(p.priceCents * (p.quantity ?? 1))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button aria-label="Change status">
                      <StatusBadge status={getPartStatus(p)} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {(['ordered', 'shipped', 'received', 'installed', 'cancelled'] as const).map(s => {
                      const statusLabel = s.charAt(0).toUpperCase() + s.slice(1)
                      return (
                        <form key={s} action={setPartStatusAction}>
                          <input type="hidden" name="partId" value={p._id} />
                          <input type="hidden" name="status" value={s} />
                          <DropdownMenuItem asChild>
                            <button type="submit" className="w-full text-left">
                              {`Mark as ${statusLabel}`}
                            </button>
                          </DropdownMenuItem>
                        </form>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <PartDialog
                    mode="edit"
                    part={{
                      _id: p._id,
                      name: p.name,
                      supplierId: p.supplierId,
                      partNumber: p.partNumber,
                      sourceUrl: p.sourceUrl,
                      priceCents: p.priceCents,
                      quantity: p.quantity,
                      isForCar: p.isForCar,
                      purchasedOn: p.purchasedOn,
                    }}
                    suppliers={suppliers}
                  />
                  <DeletePartDialog partId={p._id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filtered.length === 0 ? 0 : start + 1} to {Math.min(start + pageSize, filtered.length)} of{' '}
          {filtered.length} results
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="cursor-pointer" onClick={() => setPage(p => Math.max(1, p - 1))} />
            </PaginationItem>
            {Array.from({ length: pageCount })
              .slice(0, 5)
              .map((_, i) => {
                const index = i + 1
                return (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={index === currentPage}
                      onClick={() => setPage(index)}>
                      {index}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
            {pageCount > 5 ? (
              <PaginationItem>
                <span className="px-2">…</span>
              </PaginationItem>
            ) : null}
            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={() => setPage(p => Math.min(pageCount, p + 1))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
