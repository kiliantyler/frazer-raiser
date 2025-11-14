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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import type { CurrentUser } from '@/lib/auth'
import { signOut } from '@workos-inc/authkit-nextjs'
import {
  Bell,
  ClipboardList,
  Images,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Shield,
  User,
  Users,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo } from 'react'
import type { Route } from 'next'
import { usePathname } from 'next/navigation'

function SidebarNavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  const tooltipText = typeof children === 'string' ? children : String(children)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={tooltipText}>
        <Link href={href as Route}>
          <Icon className="h-4 w-4" />
          <span>{children}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function PrivateSidebar({ user }: { user: CurrentUser }) {
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div
            className="h-6 w-6 bg-primary shrink-0"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            aria-hidden="true"
          />
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]/sidebar-wrapper:hidden">
            <span className="font-serif text-lg font-semibold truncate">Frazer Raiser</span>
            <span className="text-xs text-muted-foreground truncate">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavLink href="/dashboard" icon={LayoutDashboard}>
                Dashboard
              </SidebarNavLink>
              <SidebarNavLink href="/tasks" icon={Wrench}>
                Tasks
              </SidebarNavLink>
              <SidebarNavLink href="/parts-costs" icon={Package}>
                Parts & Costs
              </SidebarNavLink>
              <SidebarNavLink href="/suppliers" icon={Users}>
                Suppliers
              </SidebarNavLink>
              <SidebarNavLink href="/work-log" icon={ClipboardList}>
                Work Log
              </SidebarNavLink>
              <SidebarNavLink href="/internal-gallery" icon={Images}>
                Internal Gallery
              </SidebarNavLink>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarNavLink href="/admin" icon={Shield}>
                Admin
              </SidebarNavLink>
              <SidebarNavLink href="/collaborators" icon={Users}>
                Collaborators
              </SidebarNavLink>
              <SidebarNavLink href="/settings" icon={Settings}>
                Settings
              </SidebarNavLink>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notifications" onClick={() => {}}>
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={user?.email || 'User'}>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={user?.image} alt={user?.email ?? 'User'} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">{userInitial}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">
                    {user?.firstName || user?.lastName
                      ? [user?.firstName, user?.lastName].filter(Boolean).join(' ')
                      : user?.email || 'User'}
                  </span>
                </SidebarMenuButton>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

