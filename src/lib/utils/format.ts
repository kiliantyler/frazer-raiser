export function formatCurrency(cents: number): string {
  const dollars = cents / 100
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars)
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  if (diffDays === 1) {
    return 'Yesterday'
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  if (diffDays < 14) {
    return '1 week ago'
  }
  if (diffDays < 21) {
    return '2 weeks ago'
  }
  return `${Math.floor(diffDays / 7)} weeks ago`
}

export function formatDueDate(dueDate: number): string {
  const now = Date.now()
  const diffMs = dueDate - now
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'Overdue'
  }
  if (diffDays === 0) {
    return 'Due today'
  }
  if (diffDays === 1) {
    return 'Due: 1 Day'
  }
  if (diffDays < 7) {
    return `Due: ${diffDays} Days`
  }
  if (diffDays < 14) {
    return 'Due: 1 Week'
  }
  if (diffDays < 21) {
    return 'Due: 2 Weeks'
  }
  return `Due: ${Math.floor(diffDays / 7)} Weeks`
}

export function normalizeExternalUrl(url: string | undefined): `https://${string}` | `http://${string}` | null {
  if (!url) return null
  if (url.startsWith('http://')) {
    return url as `http://${string}`
  }
  if (url.startsWith('https://')) {
    return url as `https://${string}`
  }
  return `https://${url}` as `https://${string}`
}

