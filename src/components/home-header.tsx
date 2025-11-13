'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
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

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
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

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 shadow-lg">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-6">
        <div className="relative flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2.5 transition-all duration-500 hover:opacity-80 group">
            <span
              aria-hidden="true"
              className="inline-block size-4 rounded-sm bg-primary shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg"
            />
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text transition-all duration-500 group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary/80">
              Frazer Raiser
            </span>
          </Link>
          <div className="group/nav absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-card/50 px-2 py-1.5 shadow-sm backdrop-blur-sm animate-in fade-in duration-700">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/timeline">Timeline</NavLink>
            <NavLink href="/updates">Updates</NavLink>
          </div>
          <div className="w-[120px]" />
        </div>
        {/* Mobile Navigation */}
        <div className="flex items-center justify-center gap-4 pb-4 md:hidden">
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/gallery">Gallery</MobileNavLink>
          <MobileNavLink href="/timeline">Timeline</MobileNavLink>
          <MobileNavLink href="/updates">Updates</MobileNavLink>
        </div>
      </nav>
    </header>
  )
}
