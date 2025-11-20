'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface WorkLogFiltersProps {
  totalHours: number
  totalCost: number
  timeRange: string
  onTimeRangeChange: (value: string) => void
  selectedUser: string
  onUserChange: (value: string) => void
  selectedTag: string
  onTagChange: (value: string) => void
  uniqueUsers: string[]
  uniqueTags: string[]
}

export function WorkLogFilters({
  totalHours,
  totalCost,
  timeRange,
  onTimeRangeChange,
  selectedUser,
  onUserChange,
  selectedTag,
  onTagChange,
  uniqueUsers,
  uniqueTags,
}: WorkLogFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {timeRange === 'all' ? 'All time' : `Last ${timeRange} days`}: {totalHours.toFixed(1)} hours • $
        {(totalCost / 100).toFixed(2)}
      </div>

      <div className="flex gap-2">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
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

        <Select value={selectedUser} onValueChange={onUserChange}>
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

        <Select value={selectedTag} onValueChange={onTagChange}>
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
  )
}
