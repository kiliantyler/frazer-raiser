'use client'

import { useEffect, useRef, useState } from 'react'

interface SectionFadeInProps {
  children: React.ReactNode
  delayMs?: number
}

export function SectionFadeIn({ children, delayMs }: SectionFadeInProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const target = containerRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [])

  const style = typeof delayMs === 'number' ? { transitionDelay: `${delayMs}ms` } : undefined

  return (
    <div
      ref={containerRef}
      style={style}
      className={`transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}>
      {children}
    </div>
  )
}
