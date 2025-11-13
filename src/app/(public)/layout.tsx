import { HomeHeader } from '@/components/home-header'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HomeHeader />
      {children}
    </>
  )
}
