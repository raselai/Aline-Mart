'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin') || false
  const isAuthPage = pathname?.startsWith('/auth') || false

  return (
    <>
      {!isAdminPage && !isAuthPage && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdminPage && !isAuthPage && <Footer />}
    </>
  )
}
