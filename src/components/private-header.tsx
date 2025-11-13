'use client'

import { Navigation } from '@/components/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { CurrentUser } from '@/lib/auth'
import { signOut } from '@workos-inc/authkit-nextjs'
import { Bell, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'

export function PrivateHeader({ user }: { user: CurrentUser }) {
  const userInitial = useMemo(() => {
    if (!user) return 'U'
    const nameInitial = (user.firstName?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()
    return nameInitial
  }, [user])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ returnTo: '/' })
    } catch {
      // no-op: rely on server to clear session even if client redirect fails
    }
  }, [])

  return (
    <header className="border-b border-border/40 bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 bg-primary"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            aria-hidden="true"
          />
          <span className="font-serif text-lg font-semibold">Frazer Raiser Dashboard</span>
        </div>

        {/* Navigation */}
        <Navigation />

        {/* Right side: Notifications and User */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
            onClick={() => {}}
            onKeyDown={() => {}}>
            <Bell className="h-5 w-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full focus:outline-hidden focus:ring-2 focus:ring-primary/50"
                aria-label="Open user menu">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image} alt={user?.email ?? 'User'} />
                  <AvatarFallback className="bg-primary/20 text-primary">{userInitial}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.firstName || user?.lastName
                    ? [user?.firstName, user?.lastName].filter(Boolean).join(' ')
                    : user?.email || 'User'}
                </span>
                {user?.email ? <span className="text-xs text-muted-foreground">{user.email}</span> : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2" aria-label="Go to profile dashboard">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2" aria-label="Open settings">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-700 dark:text-red-500"
                aria-label="Sign out">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
