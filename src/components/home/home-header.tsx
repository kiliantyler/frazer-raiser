'use client'

import Image from 'next/image'
import { MobileNavLink } from './mobile-nav-link'
import { NavLink } from './nav-link'

export function HomeHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-6">
        {/* Desktop Navigation */}
        <div className="hidden md:grid grid-cols-3 items-center py-6">
          <div className="flex items-center pointer-events-auto">
            <Image src="/frazer.svg" alt="Frazer Logo" width={120} height={40} className="h-20 w-auto" />
          </div>
          <div className="flex justify-center pointer-events-auto">
            <div className="group/nav flex items-center gap-1 rounded-full border border-border/50 bg-card/50 px-2 py-1.5 shadow-sm backdrop-blur-sm">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/gallery">Gallery</NavLink>
              <NavLink href="/updates">Updates</NavLink>
            </div>
          </div>
          <div></div>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-center gap-2 py-4 pointer-events-auto">
          <MobileNavLink href="/">Home</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/gallery">Gallery</MobileNavLink>
          <MobileNavLink href="/updates">Updates</MobileNavLink>
        </div>
      </nav>
    </header>
  )
}
