'use client'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import type { DayPickerSingleProps } from 'react-day-picker'
import { DayPicker } from 'react-day-picker'

import 'react-day-picker/style.css'

type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  name?: string
} & Omit<DayPickerSingleProps, 'mode' | 'selected' | 'onSelect'>

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  disabled,
  name,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !value && 'text-muted-foreground')}
            disabled={disabled}
            type="button">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={date => {
              onChange?.(date)
              setOpen(false)
            }}
            initialFocus
            {...props}
          />
        </PopoverContent>
      </Popover>
      {name && value && <input type="hidden" name={name} value={format(value, 'yyyy-MM-dd')} />}
    </div>
  )
}
