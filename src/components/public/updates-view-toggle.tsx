'use client'

import type { TimelineItem } from '@/types/updates'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GridUpdatesList } from './updates-grid'
import { TimelineUpdatesList } from './updates-timeline'

export function UpdatesViewToggle({ items }: { items: Array<TimelineItem> }) {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get('view')
  const initialView = viewParam === 'grid' ? 'grid' : 'timeline'
  const [view, setView] = useState<'timeline' | 'grid'>(initialView)

  useEffect(() => {
    const currentViewParam = searchParams.get('view')
    const currentView = currentViewParam === 'grid' ? 'grid' : 'timeline'
    if (currentView !== view) {
      setView(currentView)
    }
  }, [searchParams, view])

  return (
    <div className="w-full">
      {view === 'timeline' ? <TimelineUpdatesList items={items} /> : <GridUpdatesList items={items} />}
    </div>
  )
}
