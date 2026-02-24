/**
 * Admin Password Reset API
 * POST /api/admin/admins/[id]/reset-password
 * SUPER_ADMIN only
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSuperAdmin, hashPassword, logAdminAction, AdminAuthError } from '@/lib/admin-auth'

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const superAdmin = await requireSuperAdmin()
    const { id } = await props.params
    const body = await request.json()

    const { password } = body as { password?: string }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Verify target exists and is admin
    const { data: targetUser } = await supabase
      .from('User')
      .select('id, role, email')
      .eq('id', id)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    if (targetUser.role === 'SUPER_ADMIN' && id !== superAdmin.id) {
      return NextResponse.json(
        { error: 'Cannot reset another super admin password' },
        { status: 403 }
      )
    }

    if (targetUser.role !== 'ADMIN' && targetUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'User is not an admin' }, { status: 400 })
    }

    const hashed = await hashPassword(password)
    const { error: updateError } = await supabase
      .from('User')
      .update({ password: hashed })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    await logAdminAction(superAdmin.id, 'RESET_PASSWORD', 'USER', id, {
      email: targetUser.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
