'use client'

import { useEffect } from 'react'

export default function JournalEditorLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Find the existing header and add our content slot
    const header = document.querySelector('header')
    if (header && !document.getElementById('journal-editor-header-content')) {
      const existingTrigger = header.querySelector('[data-radix-sidebar-trigger]')
      const contentSlot = document.createElement('div')
      contentSlot.id = 'journal-editor-header-content'
      contentSlot.className = 'flex-1 flex items-center'

      // Insert after the sidebar trigger
      if (existingTrigger && existingTrigger.nextSibling) {
        existingTrigger.nextSibling.before(contentSlot)
      } else {
        header.append(contentSlot)
      }
    }
  }, [])

  return <>{children}</>
}
