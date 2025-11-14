'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'

interface AnimateOnViewProps {
  children: React.ReactNode
  className?: string
}

export function AnimateOnView({ children, className }: AnimateOnViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const element = containerRef.current
    if (!element) {
      return
    }

    if (hasShown) {
      return
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setHasShown(true)
        }
      })
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [hasShown])

  const stateClasses = hasShown ? 'animate-fade-up-soft' : 'opacity-0 translate-y-4'

  return (
    <div ref={containerRef} className={`${stateClasses} ${className ?? ''}`}>
      {children}
    </div>
  )
}


