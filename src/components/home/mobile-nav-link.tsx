'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href as Route}
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
      }`}>
      {children}
    </Link>
  )
}
