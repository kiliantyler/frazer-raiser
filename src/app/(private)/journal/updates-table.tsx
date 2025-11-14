'use client'

import { EmptyState } from '@/components/private/empty-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import Link from 'next/link'
import { PublishUpdateDialog } from './publish-update-dialog'

type Update = {
  _id: string
  title: string
  slug: string
  publishStatus: 'draft' | 'published'
  createdAt: number
  publishedAt?: number
  imageIds: string[]
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function UpdatesTable({ updates }: { updates: Array<Update> }) {
  if (updates.length === 0) {
    return <EmptyState message="No journal entries yet" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {updates.map(update => (
          <TableRow key={update._id}>
            <TableCell className="font-medium">{update.title}</TableCell>
            <TableCell>
              <Badge variant={update.publishStatus === 'published' ? 'default' : 'secondary'}>
                {update.publishStatus}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{formatDate(update.createdAt)}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {update.publishedAt ? formatDate(update.publishedAt) : '—'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" asChild aria-label="Edit update">
                  <Link href={`/journal/${update._id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <PublishUpdateDialog update={update} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
