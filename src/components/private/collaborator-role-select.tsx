'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { useState } from 'react'

type CollaboratorRole = 'ADMIN' | 'COLLABORATOR' | 'VIEWER'

type CollaboratorRoleSelectProps = {
  initialRole: CollaboratorRole
}

export function CollaboratorRoleSelect({ initialRole }: CollaboratorRoleSelectProps) {
  const [value, setValue] = useState<CollaboratorRole>(initialRole)
  const [isDirty, setIsDirty] = useState(false)

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextRole = event.target.value as CollaboratorRole
    setValue(nextRole)
    setIsDirty(nextRole !== initialRole)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        name="role"
        value={value}
        onChange={handleChange}
        className="bg-background border border-border/40 rounded px-2 py-1 text-sm"
        aria-label="Change collaborator role">
        <option value="VIEWER">Viewer</option>
        <option value="COLLABORATOR">Collaborator</option>
        <option value="ADMIN">Admin</option>
      </select>
      <span className="inline-flex h-8 w-8 items-center justify-center">
        <Button
          type="submit"
          size="icon-sm"
          variant="outline"
          className={`h-8 w-8 transition-opacity ${isDirty ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-label="Confirm role change">
          <Check className="h-4 w-4" />
        </Button>
      </span>
    </div>
  )
}
