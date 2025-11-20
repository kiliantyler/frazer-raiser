'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as React from 'react'

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ tags, onTagsChange, placeholder = 'Add tag (press Enter)' }: TagInputProps) {
  const [tagInput, setTagInput] = React.useState('')

  const addTag = () => {
    if (tagInput.trim()) {
      onTagsChange([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, idx) => idx !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder={placeholder}
          aria-label="Add tag"
        />
        <Button type="button" onClick={addTag} variant="secondary">
          Add
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(i)} className="hover:text-destructive">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
