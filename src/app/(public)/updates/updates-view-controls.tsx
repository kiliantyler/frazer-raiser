'use client'

import { Button } from '@/components/ui/button'
import type { Route } from 'next'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function UpdatesViewControls() {
  const searchParams = useSearchParams()
  const router = useRouter()
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

  function handleToggleView() {
    const newView: 'timeline' | 'grid' = view === 'grid' ? 'timeline' : 'grid'
    setView(newView)
    const params = new URLSearchParams(searchParams.toString())
    if (newView === 'timeline') {
      params.delete('view')
    } else {
      params.set('view', newView)
    }
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(`/updates${newUrl}` as Route, { scroll: false })
  }

  const isCompact = view === 'grid'

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleToggleView}
      className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
      aria-label={isCompact ? 'Switch to timeline view' : 'Switch to compact list view'}
      title={isCompact ? 'Switch to timeline view' : 'Switch to compact list view'}>
      {isCompact ? 'Timeline' : 'Compact'}
    </Button>
  )
}
