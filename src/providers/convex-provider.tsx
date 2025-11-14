'use client'

import { env } from '@/env.js'
import { ConvexProvider as ConvexProviderBase, ConvexReactClient } from 'convex/react'
import { useMemo } from 'react'

type ConvexProviderProps = {
  children: React.ReactNode
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  const convex = useMemo(() => {
    const url = env.NEXT_PUBLIC_CONVEX_URL
    if (!url) return null
    return new ConvexReactClient(url)
  }, [])

  if (!convex) {
    return <>{children}</>
  }

  return <ConvexProviderBase client={convex}>{children}</ConvexProviderBase>
}
