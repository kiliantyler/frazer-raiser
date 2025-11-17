'use client'

import Link from 'next/link'
import { MobileNavLink } from './mobile-nav-link'
import { NavLink } from './nav-link'

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/90 shadow-lg">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-6">
        <div className="relative flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2.5 transition-all duration-500 hover:opacity-80 group">
            <span
              aria-hidden="true"
              className="inline-block size-5 rounded-sm bg-primary shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg"
            />
            <span className="text-2xl font-bold tracking-widest bg-linear-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text transition-all duration-500 group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary/80 font-frazer">
              Frazer Raiser
            </span>
          </Link>
          <div className="group/nav absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-card/50 px-2 py-1.5 shadow-sm backdrop-blur-sm">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/updates">Updates</NavLink>
          </div>
          <div className="w-[120px]" />
        </div>
        {/* Mobile Navigation */}
        <div className="flex items-center justify-center gap-4 pb-4 md:hidden">
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/gallery">Gallery</MobileNavLink>
          <MobileNavLink href="/updates">Updates</MobileNavLink>
        </div>
      </nav>
    </header>
  )
}
