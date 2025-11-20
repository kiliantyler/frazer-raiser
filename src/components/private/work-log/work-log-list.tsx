'use client'

import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import type { WorkLogItem } from '@/types/work-log'
import { WorkLogDialog } from './work-log-dialog'
import { WorkLogFilters } from './work-log-filters'
import { WorkLogItemCard } from './work-log-item-card'

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
      <WorkLogFilters
        totalHours={totalHours}
        totalCost={totalCost}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        uniqueUsers={uniqueUsers}
        uniqueTags={uniqueTags}
      />

      <div className="space-y-2">
        {filteredLogs.map(log => (
          <WorkLogItemCard
            key={log._id}
            log={log}
            onEdit={() => setEditingEntry(log)}
            onDelete={() => setEntryToDelete(log._id)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={!!entryToDelete}
        onOpenChange={open => !open && setEntryToDelete(null)}
        title="Delete Work Log?"
        description="This action cannot be undone. This will permanently delete this work log entry."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleDelete}
      />

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
