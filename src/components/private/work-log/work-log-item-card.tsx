'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { WorkLogItem } from '@/types/work-log'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'

interface WorkLogItemCardProps {
  log: WorkLogItem
  onEdit: () => void
  onDelete: () => void
}

export function WorkLogItemCard({ log, onEdit, onDelete }: WorkLogItemCardProps) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:bg-accent/50">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{log.title}</span>
            <span className="text-sm text-muted-foreground">{format(new Date(log.date), 'MM/dd/yyyy')}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {log.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="rounded-full px-2 py-0 text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-sm font-medium text-muted-foreground">{log.hours}h</div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {log.contributors && log.contributors.length > 0 && log.contributors[0] && (
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                {log.contributors[0].avatarUrl && (
                  <AvatarImage src={log.contributors[0].avatarUrl} alt={log.contributors[0].name} />
                )}
                <AvatarFallback className="text-[8px]">
                  {log.contributors[0].name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>{log.contributors[0].name}</span>
              {log.contributors.length > 1 && (
                <span className="text-xs opacity-70">+{log.contributors.length - 1} others</span>
              )}
            </div>
          )}
          {log.contributors && log.contributors.length > 0 && <span>•</span>}
          <span>{log.imageIds?.length || 0} photos</span>
        </div>

        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onDelete}>
            <Trash2 className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
