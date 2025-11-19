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
      className={`px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full ${
        isActive
          ? 'text-primary-foreground bg-primary'
          : 'text-muted-foreground bg-card/50 border border-border/50 backdrop-blur-sm hover:text-primary-foreground hover:bg-primary'
      }`}>
      {children}
    </Link>
  )
}
