import { PrivateHeader } from '@/components/private-header'
import { getCurrentUserOrNull } from '@/lib/auth'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  await withAuth({ ensureSignedIn: true })
  const user = await getCurrentUserOrNull()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PrivateHeader user={user} />

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  )
}
