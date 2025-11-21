'use client'

import { PartsCostsHeaderAction } from '@/components/private/parts-costs/parts-costs-header-action'
import { SupplierDialog } from '@/components/private/suppliers/supplier-dialog'
import { TaskDialog } from '@/components/private/tasks/task-dialog'
import { WorkLogDialog } from '@/components/private/work-log/work-log-dialog'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ...

function HeaderTitle() {
  const pathname = usePathname()

  // Journal page
  if (pathname === '/journal') {
    return <h1 className="font-serif text-2xl">Journal Updates</h1>
  }

  // Tasks page
  if (pathname === '/tasks') {
    return <h1 className="font-serif text-2xl">Tasks</h1>
  }

  // Dashboard page
  if (pathname === '/dashboard') {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl">1948 Frazer Restoration Dashboard</h1>
        <p className="text-sm text-muted-foreground">An overview of project status, spending, and recent activity.</p>
      </div>
    )
  }

  // Settings page
  if (pathname === '/settings') {
    return <h1 className="font-serif text-2xl">Settings</h1>
  }

  // Admin page
  if (pathname === '/admin') {
    return (
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Administer collaborators, content, and key project data from a single place.
        </p>
      </div>
    )
  }

  // Suppliers page
  if (pathname === '/suppliers') {
    return <h1 className="font-serif text-2xl">Suppliers</h1>
  }

  // Profile page
  if (pathname === '/profile') {
    return <h1 className="font-serif text-2xl">Profile</h1>
  }

  // Internal Gallery page
  if (pathname === '/internal-gallery') {
    return <h1 className="font-serif text-2xl">Internal Gallery</h1>
  }

  // Work Log page
  if (pathname === '/work-log') {
    return <h1 className="font-serif text-2xl">Work Log</h1>
  }

  // Collaborators page
  if (pathname === '/collaborators') {
    return <h1 className="font-serif text-2xl">Collaborators</h1>
  }

  // Parts & Costs page
  if (pathname === '/parts-costs') {
    return <h1 className="font-serif text-2xl">Parts & Cost Tracker</h1>
  }

  // Default fallback
  return null
}

function HeaderActions() {
  const pathname = usePathname()

  // Journal page
  if (pathname === '/journal') {
    return (
      <Button asChild>
        <Link href="/journal/new">
          <Plus className="mr-1.5 size-4" />
          New Journal Entry
        </Link>
      </Button>
    )
  }

  // Tasks page
  if (pathname === '/tasks') {
    return <TaskDialog />
  }

  // Suppliers page
  if (pathname === '/suppliers') {
    return <SupplierDialog mode="create" />
  }

  // Parts & Costs page
  if (pathname === '/parts-costs') {
    return <PartsCostsHeaderAction />
  }

  // Work Log page
  if (pathname === '/work-log') {
    return <WorkLogDialog />
  }

  // Default fallback - no actions
  return null
}

export function PrivateHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <HeaderTitle />
      </div>
      <HeaderActions />
    </header>
  )
}
