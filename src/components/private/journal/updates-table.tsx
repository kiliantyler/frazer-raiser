'use client'

import { EmptyState } from '@/components/private/empty-state'
import { UpdateImageCell } from '@/components/private/journal/update-image-cell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatShortDate } from '@/lib/utils/format'
import type { Update } from '@/types/updates'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { DeleteUpdateDialog } from './delete-update-dialog'
import { PublishUpdateDialog } from './publish-update-dialog'

export function UpdatesTable({ updates }: { updates: Array<Update> }) {
  if (updates.length === 0) {
    return <EmptyState message="No journal entries yet" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Display Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {updates.map(update => {
          const displayDate = update.eventDate ?? update.publishedAt ?? update.createdAt
          return (
            <TableRow key={update._id}>
              <TableCell>
                <UpdateImageCell updateId={update._id} initialImageIds={update.imageIds} />
              </TableCell>
              <TableCell className="font-medium">{update.title}</TableCell>
              <TableCell>
                <Badge variant={update.publishStatus === 'published' ? 'default' : 'secondary'}>
                  {update.publishStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatShortDate(update.createdAt)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatShortDate(displayDate)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild aria-label="Edit update">
                    <Link href={`/journal/${update._id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteUpdateDialog updateId={update._id} />
                  <PublishUpdateDialog update={update} />
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
