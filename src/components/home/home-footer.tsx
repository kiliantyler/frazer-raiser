'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HomeFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Frazer Raiser. All rights reserved.
          </p>
          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto" aria-label="Login">
            <Link href="/dashboard" prefetch={false}>
              Login
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}
