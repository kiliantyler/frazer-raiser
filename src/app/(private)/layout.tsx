import { PrivateSidebar } from '@/components/private-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getCurrentUserOrNull } from '@/lib/auth'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await withAuth({ ensureSignedIn: true })
  const user = await getCurrentUserOrNull()

  return (
    <SidebarProvider>
      <PrivateSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
