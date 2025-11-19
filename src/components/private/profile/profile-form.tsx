'use client'

import { AvatarUpload } from '@/components/private/avatar-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRef, useState } from 'react'

type ProfileFormProps = {
  initialName: string
  initialEmail: string
  initialAvatarUrl?: string
  updateProfileAction: (formData: FormData) => Promise<void>
}

export function ProfileForm({ initialName, initialEmail, initialAvatarUrl, updateProfileAction }: ProfileFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialAvatarUrl)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setShowSuccess(false)

    try {
      if (avatarUrl) {
        formData.set('avatarUrl', avatarUrl)
      } else if (initialAvatarUrl) {
        formData.set('avatarUrl', initialAvatarUrl)
      }
      await updateProfileAction(formData)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input type="hidden" name="avatarUrl" value={avatarUrl ?? initialAvatarUrl ?? ''} />
      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <AvatarUpload
          currentAvatarUrl={avatarUrl ?? initialAvatarUrl}
          currentName={initialName}
          onUploadComplete={setAvatarUrl}
        />
        <p className="text-sm text-muted-foreground">
          Upload a profile picture. Changes will be synced to WorkOS if configured.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" name="name" type="text" defaultValue={initialName} required aria-label="Full name" />
        <p className="text-sm text-muted-foreground">Your display name as it appears throughout the application.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" defaultValue={initialEmail} required aria-label="Email address" />
        <p className="text-sm text-muted-foreground">
          Your email address. This will be used for notifications and account recovery.
        </p>
      </div>

      <div className="space-y-2">
        <Button type="submit" aria-label="Save profile changes" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
        {showSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400" role="status" aria-live="polite">
            Profile saved successfully!
          </p>
        )}
      </div>
    </form>
  )
}
