import { FormCard } from '@/components/private/form-card'
import { ProfileForm } from '@/components/private/profile/profile-form'
import { getUserByWorkosUserId } from '@/lib/data/users'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'
import { updateProfileAction } from './actions'

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
