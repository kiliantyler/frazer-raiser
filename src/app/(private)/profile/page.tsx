import { FormCard } from '@/components/private/form-card'
import { PageHeader } from '@/components/private/page-header'
import { api } from '@convex/_generated/api'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { fetchQuery } from 'convex/nextjs'
import { redirect } from 'next/navigation'
import { updateProfileAction } from './actions'
import { ProfileForm } from './profile-form'

async function getUserByWorkosUserId(workosUserId: string) {
  'use cache'
  return await fetchQuery(api.users.getByWorkosUserId, { workosUserId })
}

export default async function ProfilePage() {
  const { user } = await withAuth({ ensureSignedIn: true })
  if (!user) {
    redirect('/')
  }

  const me = await getUserByWorkosUserId(user.id)

  if (!me) {
    redirect('/')
  }

  return (
    <section className="space-y-6">
      <PageHeader title="Profile" />

      <FormCard title="Personal Information">
        <ProfileForm
          initialName={me.name}
          initialEmail={me.email}
          initialAvatarUrl={me.avatarUrl}
          updateProfileAction={updateProfileAction}
        />
      </FormCard>
    </section>
  )
}
