'use client'

import { createTaskAction } from '@/app/(private)/tasks/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'

export function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    await createTaskAction(formData)
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2">
      <Input name="title" placeholder="New task title" aria-label="New task title" required />
      <Button type="submit">Add Task</Button>
    </form>
  )
}
