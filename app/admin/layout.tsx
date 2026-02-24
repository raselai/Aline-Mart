import { getAdminSessionWithPermissions } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current pathname
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // ⚠️ CRITICAL: Skip auth check for login page to prevent redirect loop
  // DO NOT REMOVE THIS CHECK - it prevents infinite 307 redirects
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/(auth)')
  const isInvoicePage = pathname.includes('/invoice')

  if (isLoginPage) {
    // Just render children without sidebar/header for login page
    return <>{children}</>
  }

  // Render invoice pages without sidebar/header for clean printing
  if (isInvoicePage) {
    return <>{children}</>
  }

  // Get admin session with permissions (server-side check) for protected admin pages
  const session = await getAdminSessionWithPermissions()

  // This should never happen due to proxy.ts, but double-check
  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar permissions={session.permissions} role={session.user.role} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col" style={{ minWidth: '320px' }}>
        {/* Header */}
        <AdminHeader user={session.user} />

        {/* Page Content */}
        <main
          className="flex-1 p-8"
          style={{
            backgroundColor: '#F5F5F5',
            minHeight: 'calc(100vh - 80px)'
          }}
        >
          <div
            className="w-full mx-auto"
            style={{
              maxWidth: '1400px',
              minWidth: '280px'
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
