/**
 * Admin Management API
 * GET  /api/admin/admins — List all admins with permissions
 * POST /api/admin/admins — Create a new admin
 * SUPER_ADMIN only
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireSuperAdmin, hashPassword, logAdminAction, AdminAuthError } from '@/lib/admin-auth'
import { ADMIN_MODULE_KEYS, type AdminModuleKey } from '@/lib/admin-modules'

export async function GET() {
  try {
    const admin = await requireSuperAdmin()

    // Get all admin/super_admin users
    const { data: users, error } = await supabase
      .from('User')
      .select('id, email, name, role, createdAt')
      .in('role', ['ADMIN', 'SUPER_ADMIN'])
      .order('createdAt', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 })
    }

    // Get permissions for all admin users
    const userIds = (users || []).map((u) => u.id)
    const { data: permissions } = await supabase
      .from('admin_permissions')
      .select('user_id, modules, is_active, created_at')
      .in('user_id', userIds)

    const permMap = new Map(
      (permissions || []).map((p) => [p.user_id, p])
    )

    const admins = (users || []).map((user) => {
      const perm = permMap.get(user.id)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        modules: perm ? (perm.modules as string[]) : [],
        isActive: user.role === 'SUPER_ADMIN' ? true : perm ? perm.is_active : true,
      }
    })

    return NextResponse.json({ admins })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching admins:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const superAdmin = await requireSuperAdmin()
    const body = await request.json()

    const { email, name, password, modules } = body as {
      email?: string
      name?: string
      password?: string
      modules?: string[]
    }

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Validate modules
    const validModules = (modules || []).filter((m): m is AdminModuleKey =>
      ADMIN_MODULE_KEYS.includes(m as AdminModuleKey)
    )

    // Check if user already exists
    const { data: existing } = await supabase
      .from('User')
      .select('id, role')
      .eq('email', email)
      .single()

    if (existing) {
      // If user exists as CUSTOMER, promote them
      if (existing.role === 'CUSTOMER') {
        const hashedPassword = await hashPassword(password)

        const { error: updateError } = await supabase
          .from('User')
          .update({ role: 'ADMIN', password: hashedPassword, name: name || undefined })
          .eq('id', existing.id)

        if (updateError) {
          return NextResponse.json({ error: 'Failed to promote user' }, { status: 500 })
        }

        // Create permissions row
        await supabase.from('admin_permissions').insert({
          user_id: existing.id,
          modules: validModules,
          is_active: true,
          created_by: superAdmin.id,
        })

        await logAdminAction(superAdmin.id, 'PROMOTE_TO_ADMIN', 'USER', existing.id, {
          email,
          modules: validModules,
        })

        return NextResponse.json({ success: true, adminId: existing.id })
      }

      return NextResponse.json(
        { error: 'User already exists as admin' },
        { status: 409 }
      )
    }

    // Create new user with ADMIN role
    const hashedPassword = await hashPassword(password)
    const { data: newUser, error: createError } = await supabase
      .from('User')
      .insert({
        id: crypto.randomUUID(),
        email,
        name: name || null,
        password: hashedPassword,
        role: 'ADMIN',
      })
      .select('id')
      .single()

    if (createError || !newUser) {
      console.error('Error creating admin user:', createError)
      return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
    }

    // Create permissions row
    await supabase.from('admin_permissions').insert({
      user_id: newUser.id,
      modules: validModules,
      is_active: true,
      created_by: superAdmin.id,
    })

    await logAdminAction(superAdmin.id, 'CREATE_ADMIN', 'USER', newUser.id, {
      email,
      modules: validModules,
    })

    return NextResponse.json({ success: true, adminId: newUser.id }, { status: 201 })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
