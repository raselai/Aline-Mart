/**
 * Single Admin Management API
 * GET    /api/admin/admins/[id] — Get admin details
 * PUT    /api/admin/admins/[id] — Update admin modules/status/name
 * DELETE /api/admin/admins/[id] — Demote to CUSTOMER and remove permissions
 * SUPER_ADMIN only
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSuperAdmin, logAdminAction, AdminAuthError } from '@/lib/admin-auth'
import { ADMIN_MODULE_KEYS, type AdminModuleKey } from '@/lib/admin-modules'

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireSuperAdmin()
    const { id } = await props.params

    const { data: user, error } = await supabase
      .from('User')
      .select('id, email, name, role, createdAt')
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'User is not an admin' }, { status: 404 })
    }

    const { data: perm } = await supabase
      .from('admin_permissions')
      .select('modules, is_active, created_at, created_by')
      .eq('user_id', id)
      .single()

    return NextResponse.json({
      admin: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        modules: perm ? (perm.modules as string[]) : [],
        isActive: user.role === 'SUPER_ADMIN' ? true : perm ? perm.is_active : true,
        createdBy: perm?.created_by || null,
      },
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const superAdmin = await requireSuperAdmin()
    const { id } = await props.params
    const body = await request.json()

    // Cannot modify SUPER_ADMIN
    const { data: targetUser } = await supabase
      .from('User')
      .select('id, role, email')
      .eq('id', id)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    if (targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Cannot modify super admin permissions' },
        { status: 403 }
      )
    }

    if (targetUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'User is not an admin' }, { status: 400 })
    }

    const { modules, isActive, name } = body as {
      modules?: string[]
      isActive?: boolean
      name?: string
    }

    // Update user name if provided
    if (name !== undefined) {
      await supabase.from('User').update({ name }).eq('id', id)
    }

    // Update permissions
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

    if (modules !== undefined) {
      updates.modules = modules.filter((m): m is AdminModuleKey =>
        ADMIN_MODULE_KEYS.includes(m as AdminModuleKey)
      )
    }

    if (isActive !== undefined) {
      updates.is_active = isActive
    }

    // Upsert permissions row
    const { data: existingPerm } = await supabase
      .from('admin_permissions')
      .select('id')
      .eq('user_id', id)
      .single()

    if (existingPerm) {
      await supabase.from('admin_permissions').update(updates).eq('user_id', id)
    } else {
      await supabase.from('admin_permissions').insert({
        user_id: id,
        modules: (modules || []).filter((m): m is AdminModuleKey =>
          ADMIN_MODULE_KEYS.includes(m as AdminModuleKey)
        ),
        is_active: isActive !== undefined ? isActive : true,
        created_by: superAdmin.id,
      })
    }

    await logAdminAction(superAdmin.id, 'UPDATE_ADMIN', 'USER', id, {
      email: targetUser.email,
      changes: { modules, isActive, name },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const superAdmin = await requireSuperAdmin()
    const { id } = await props.params

    // Cannot delete yourself
    if (id === superAdmin.id) {
      return NextResponse.json(
        { error: 'Cannot remove yourself' },
        { status: 400 }
      )
    }

    const { data: targetUser } = await supabase
      .from('User')
      .select('id, role, email')
      .eq('id', id)
      .single()

    if (!targetUser) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Cannot delete SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Cannot remove super admin' },
        { status: 403 }
      )
    }

    if (targetUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'User is not an admin' }, { status: 400 })
    }

    // Demote to CUSTOMER
    await supabase.from('User').update({ role: 'CUSTOMER' }).eq('id', id)

    // Remove permissions row (cascade will handle it, but be explicit)
    await supabase.from('admin_permissions').delete().eq('user_id', id)

    await logAdminAction(superAdmin.id, 'REMOVE_ADMIN', 'USER', id, {
      email: targetUser.email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error removing admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
