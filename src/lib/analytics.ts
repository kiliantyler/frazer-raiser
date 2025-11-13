import posthog from 'posthog-js'

export function track(event: string, properties?: Record<string, string | number | boolean>) {
  if (!posthog?.capture) return
  posthog.capture(event, properties)
}

export const FeatureFlags = {
  TIMELINE_ANIM_V1: 'timeline_anim_v1',
  BUDGET_LIVE_V1: 'budget_live_v1',
} as const
