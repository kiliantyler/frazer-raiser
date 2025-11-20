'use client'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { format } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { WorkLogItem } from '@/types/work-log'
import { WorkLogDialog } from './work-log-dialog'

export function WorkLogList() {
  const workLogs = useQuery(api.worklog.listRecent, { limit: 50 })
  const deleteWorkLog = useMutation(api.worklog.deleteEntry)
  const [entryToDelete, setEntryToDelete] = useState<Id<'workLogs'> | null>(null)
  const [editingEntry, setEditingEntry] = useState<WorkLogItem | null>(null)
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('30')

  if (!workLogs) {
    return <div>Loading work logs...</div>
  }

  // Get unique users and tags for filters
  const uniqueUsers = Array.from(new Set(workLogs.flatMap(log => log.contributors?.map(c => c.name) || []))).toSorted()

  const uniqueTags = Array.from(new Set(workLogs.flatMap(log => log.tags || []))).toSorted()

  // Filter logs
  const filteredLogs = workLogs.filter(log => {
    const matchesUser = selectedUser === 'all' || log.contributors?.some(c => c.name === selectedUser)
    const matchesTag = selectedTag === 'all' || (log.tags && log.tags.includes(selectedTag))

    let matchesTime = true
    if (timeRange !== 'all') {
      const days = Number.parseInt(timeRange)
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
      matchesTime = log.date >= cutoff
    }

    return matchesUser && matchesTag && matchesTime
  })

  // Calculate stats
  const totalHours = filteredLogs.reduce((acc, log) => acc + (log.hours || 0), 0)
  const totalCost = filteredLogs.reduce((acc, log) => acc + (log.costDeltaCents || 0), 0)

  const handleDelete = async () => {
    if (entryToDelete) {
      await deleteWorkLog({ id: entryToDelete })
      setEntryToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {timeRange === 'all' ? 'All time' : `Last ${timeRange} days`}: {totalHours.toFixed(1)} hours • $
          {(totalCost / 100).toFixed(2)}
        </div>

        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map(user => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {uniqueTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredLogs.map(log => (
          <div
            key={log._id}
            className="group relative flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:bg-accent/50">
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
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingEntry(log)}>
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setEntryToDelete(log._id)}>
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!entryToDelete} onOpenChange={open => !open && setEntryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Work Log?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this work log entry.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEntryToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingEntry && (
        <WorkLogDialog
          initialData={editingEntry}
          open={!!editingEntry}
          onOpenChange={open => !open && setEditingEntry(null)}
          trigger={null}
        />
      )}
    </div>
  )
}
