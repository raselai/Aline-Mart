import { getAdminSessionWithPermissions, isSuperAdmin } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import AdminManagement from '@/components/admin/AdminManagement'

export default async function AdminManagementPage() {
  const session = await getAdminSessionWithPermissions()

  if (!session || !isSuperAdmin(session.user.role)) {
    redirect('/admin')
  }

  return <AdminManagement />
}
