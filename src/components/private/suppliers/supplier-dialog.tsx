'use client'

import { createSupplierAction, updateSupplierAction } from '@/app/(private)/suppliers/actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Supplier } from '@/types/suppliers'
import { Pencil, Plus } from 'lucide-react'
import * as React from 'react'

export function SupplierDialog({ mode, supplier }: { mode: 'create' | 'edit'; supplier?: Supplier }) {
  const [open, setOpen] = React.useState(false)

  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit supplier">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button aria-label="Add New Supplier" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            Add New Supplier
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        </DialogHeader>
        <form
          action={async formData => {
            if (isEdit) {
              await updateSupplierAction(formData)
            } else {
              await createSupplierAction(formData)
            }
            setOpen(false)
          }}
          className="space-y-4">
          {isEdit ? <input type="hidden" name="supplierId" value={supplier?._id ?? ''} /> : null}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={supplier?.name ?? ''} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="websiteUrl">Website</Label>
            <Input id="websiteUrl" name="websiteUrl" type="url" defaultValue={supplier?.websiteUrl ?? ''} />
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? 'Save changes' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
