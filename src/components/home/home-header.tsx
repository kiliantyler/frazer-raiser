'use client'

import { MobileNavLink } from './mobile-nav-link'
import { NavLink } from './nav-link'

export function HomeHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-center py-6">
          <div className="group/nav hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-card/50 px-2 py-1.5 shadow-sm backdrop-blur-sm">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/updates">Updates</NavLink>
          </div>
        </div>
        {/* Mobile Navigation */}
        <div className="flex items-center justify-center gap-4 pb-4 md:hidden">
          <MobileNavLink href="/">Home</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/gallery">Gallery</MobileNavLink>
          <MobileNavLink href="/updates">Updates</MobileNavLink>
        </div>
      </nav>
    </header>
  )
}
