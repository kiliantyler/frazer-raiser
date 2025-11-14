'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ScrollIndicatorProps {
  className?: string
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const visibilityClass = isVisible ? 'opacity-100' : 'opacity-0'

  return (
    <div
      aria-hidden="true"
      className={`transition-opacity duration-300 ${visibilityClass} ${className ?? ''}`}>
      <ChevronDown className="size-5 text-white/80 drop-shadow-[0_0_6px_rgba(0,0,0,0.85)] animate-scroll-indicator" />
    </div>
  )
}


