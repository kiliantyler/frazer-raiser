import { PrivateHeader } from '@/components/private/private-header'
import { PrivateSidebar } from '@/components/private/private-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getCurrentUserOrNull } from '@/lib/auth'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { cookies } from 'next/headers'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await withAuth({ ensureSignedIn: true })
  const user = await getCurrentUserOrNull()
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <PrivateSidebar user={user} />
      <SidebarInset>
        <PrivateHeader />
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
