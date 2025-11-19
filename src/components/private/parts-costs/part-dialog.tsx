'use client'

import { createPartAction, updatePartAction } from '@/app/(private)/parts-costs/actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { Part } from '@/types/parts'
import type { Supplier } from '@/types/suppliers'
import { Pencil, Plus } from 'lucide-react'
import * as React from 'react'

export function PartDialog({
  mode,
  suppliers,
  part,
}: {
  mode: 'create' | 'edit'
  suppliers: Array<Supplier>
  part?: Part
}) {
  const [open, setOpen] = React.useState(false)
  const [supplierId, setSupplierId] = React.useState<string | undefined>(part?.supplierId)
  const [isForCar, setIsForCar] = React.useState<boolean>(part?.isForCar ?? true)

  const isEdit = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" aria-label="Edit part">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button aria-label="Add New Part" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 size-4" />
            Add New Part
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEdit ? 'Edit Part' : 'Add New Part'}</DialogTitle>
        </DialogHeader>
        <form
          id="part-form"
          action={async formData => {
            if (isEdit) {
              await updatePartAction(formData)
            } else {
              await createPartAction(formData)
            }
            setOpen(false)
          }}
          className="space-y-4">
          {isEdit ? <input type="hidden" name="partId" value={part?._id ?? ''} /> : null}
          <input type="hidden" name="supplierId" value={supplierId ?? ''} />
          <input type="hidden" name="isForCar" value={isForCar ? 'on' : ''} />
          <div className="grid gap-2">
            <Label htmlFor="name">Part name</Label>
            <Input id="name" name="name" defaultValue={part?.name ?? ''} required={!isEdit} />
          </div>
          <div className="grid gap-2">
            <Label id="supplier-label">Supplier</Label>
            <Select value={supplierId} onValueChange={v => setSupplierId(v)}>
              <SelectTrigger aria-labelledby="supplier-label" className="w-full">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(s => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="partNumber">Part number</Label>
            <Input id="partNumber" name="partNumber" defaultValue={part?.partNumber ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sourceUrl">Product link</Label>
            <Input id="sourceUrl" name="sourceUrl" type="url" defaultValue={part?.sourceUrl ?? ''} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={isEdit ? (part!.priceCents / 100).toFixed(2) : ''}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" name="quantity" type="number" step="1" min="1" defaultValue={part?.quantity ?? '1'} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="purchasedOn">Purchase date</Label>
            <Input
              id="purchasedOn"
              name="purchasedOn"
              type="date"
              defaultValue={part?.purchasedOn ? new Date(part.purchasedOn).toISOString().slice(0, 10) : ''}
            />
          </div>
        </form>
        <DialogFooter className="!justify-between -mx-6 -mb-6 px-6 pb-6">
          <div className="flex items-center space-x-2">
            <Switch id="isForCar" checked={isForCar} onCheckedChange={setIsForCar} />
            <Label htmlFor="isForCar" className="text-sm font-normal cursor-pointer">
              Car Part
            </Label>
          </div>
          <Button type="submit" form="part-form">
            {isEdit ? 'Save changes' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
