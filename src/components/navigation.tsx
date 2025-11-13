'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href as Route}
      className={`text-sm font-medium hover:text-foreground ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
      {children}
    </Link>
  )
}

export function Navigation() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <NavLink href="/dashboard">Dashboard</NavLink>
      <NavLink href="/tasks">Tasks</NavLink>
      <NavLink href="/parts-costs">Parts & Costs</NavLink>
      <NavLink href="/suppliers">Suppliers</NavLink>
      <NavLink href="/work-log">Work Log</NavLink>
    </nav>
  )
}
