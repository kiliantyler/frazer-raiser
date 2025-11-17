'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      href={href as Route}
      className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full group/link overflow-hidden ${
        isActive
          ? 'text-primary-foreground bg-primary group-hover/nav:bg-transparent group-hover/nav:text-muted-foreground'
          : 'text-muted-foreground'
      } hover:text-primary-foreground hover:bg-primary`}>
      <span
        className={`relative z-10 transition-transform duration-300 ${isActive ? '' : 'group-hover/link:scale-105'}`}>
        {children}
      </span>
    </Link>
  )
}
