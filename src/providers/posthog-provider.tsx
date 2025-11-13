'use client'

import { env } from '@/env.js'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

type PostHogClientProviderProps = {
  children: React.ReactNode
}

export function PostHogClientProvider({ children }: PostHogClientProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return
    // initialize once
    if (!posthog.__loaded) {
      posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false, // we’ll capture manually on route change
        person_profiles: 'identified_only',
      })
    }
  }, [])

  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return
    // capture a pageview on client route changes
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
