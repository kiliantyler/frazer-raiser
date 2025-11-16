import { HomeFooter } from '@/components/home/home-footer'
import { HomeHeader } from '@/components/home/home-header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeHeader />
      <div className="flex-1">{children}</div>
      <HomeFooter />
    </div>
  )
}
