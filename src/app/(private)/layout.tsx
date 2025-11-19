import { PrivateHeader } from '@/components/private/private-header'
import { PrivateSidebar } from '@/components/private/private-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getCurrentUserOrNull } from '@/lib/auth'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await withAuth({ ensureSignedIn: true })
  const user = await getCurrentUserOrNull()

  return (
    <SidebarProvider>
      <PrivateSidebar user={user} />
      <SidebarInset>
        <PrivateHeader />
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
