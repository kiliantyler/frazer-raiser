import { Camera, Clock, ShoppingCart, type LucideIcon } from 'lucide-react'

export function getActivityIcon(description: string): LucideIcon {
  const lower = description.toLowerCase()
  if (lower.includes('order') || lower.includes('purchas') || lower.includes('bought')) {
    return ShoppingCart
  }
  if (lower.includes('photo') || lower.includes('upload') || lower.includes('image')) {
    return Camera
  }
  return Clock
}
