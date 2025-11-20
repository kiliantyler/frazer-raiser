import { WorkLogList } from '@/components/private/work-log/work-log-list'
import { withAuth } from '@workos-inc/authkit-nextjs'

export default async function WorkLogPage() {
  // Read request data before any non-deterministic operations (Date.now) to satisfy Next RSC constraint
  await withAuth({ ensureSignedIn: true })

  return (
    <section className="space-y-6">
      <WorkLogList />
    </section>
  )
}
