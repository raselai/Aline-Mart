/**
 * Admin Authentication & Authorization Utilities
 * Handles admin role checks, session management, and audit logging
 */

import { supabase } from './supabase'
import { cookies } from 'next/headers'

// Admin role types
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN'

export interface AdminUser {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export interface AdminSession {
  user: AdminUser
  expiresAt: Date
}

/**
 * Check if a user has admin role
 */
export function isAdmin(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN'
}

/**
 * Check if a user has super admin role
 */
export function isSuperAdmin(role: UserRole): boolean {
  return role === 'SUPER_ADMIN'
}

/**
 * Get admin session from cookies
 * Returns null if no session or session expired
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')?.value

    if (!sessionToken) {
      return null
    }

    // Parse session token (format: userId:email:role:expiresAt)
    const [userId, email, role, expiresAtStr] = sessionToken.split(':')
    const expiresAt = new Date(expiresAtStr)

    // Check if session expired
    if (expiresAt < new Date()) {
      return null
    }

    // Verify user still exists and has admin role
    const { data: user, error } = await supabase
      .from('User')
      .select('id, email, name, role')
      .eq('id', userId)
      .single()

    if (error || !user || !isAdmin(user.role as UserRole)) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
      expiresAt,
    }
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}

/**
 * Create admin session and set cookie
 * Returns session token
 */
export async function createAdminSession(user: AdminUser): Promise<string> {
  // Session expires in 2 hours
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 2)

  // Create session token
  const sessionToken = `${user.id}:${user.email}:${user.role}:${expiresAt.toISOString()}`

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('admin_session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return sessionToken
}

/**
 * Clear admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

/**
 * Verify admin credentials and return user if valid
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  try {
    // For now, we'll do a simple password check
    // In production, you should use bcrypt to hash passwords
    const { data: user, error } = await supabase
      .from('User')
      .select('id, email, name, role, password')
      .eq('email', email)
      .single()

    if (error || !user) {
      return null
    }

    // Check if user has admin role
    if (!isAdmin(user.role as UserRole)) {
      return null
    }

    // Simple password check (replace with bcrypt in production!)
    // For now, we'll just check if password matches
    if (user.password !== password) {
      // In production: await bcrypt.compare(password, user.password)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    }
  } catch (error) {
    console.error('Error verifying admin credentials:', error)
    return null
  }
}

/**
 * Log admin action for audit trail
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('admin_activity_log').insert({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details ? JSON.stringify(details) : null,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error logging admin action:', error)
  }
}

/**
 * Get admin activity log
 */
export async function getAdminActivityLog(
  limit: number = 50,
  offset: number = 0
) {
  try {
    const { data, error, count } = await supabase
      .from('admin_activity_log')
      .select(
        `
        *,
        admin:User!admin_activity_log_admin_id_fkey(
          id,
          email,
          name
        )
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { logs: data, total: count }
  } catch (error) {
    console.error('Error getting admin activity log:', error)
    return { logs: [], total: 0 }
  }
}

/**
 * Require admin access (use in API routes)
 * Throws error if not admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await getAdminSession()

  if (!session) {
    throw new Error('Unauthorized: Admin access required')
  }

  return session.user
}

/**
 * Require super admin access (use in API routes)
 * Throws error if not super admin
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const session = await getAdminSession()

  if (!session || !isSuperAdmin(session.user.role)) {
    throw new Error('Unauthorized: Super admin access required')
  }

  return session.user
}
