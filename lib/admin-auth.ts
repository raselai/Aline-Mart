/**
 * Admin Authentication & Authorization Utilities
 * Handles admin role checks, session management, permissions, and audit logging
 */

import { supabase } from './supabase'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import type { AdminModuleKey } from './admin-modules'

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

export interface AdminSessionWithPermissions extends AdminSession {
  permissions: AdminModuleKey[]
}

/**
 * Custom error for admin auth/authorization failures
 */
export class AdminAuthError extends Error {
  statusCode: number
  constructor(message: string, statusCode: 401 | 403 = 401) {
    super(message)
    this.name = 'AdminAuthError'
    this.statusCode = statusCode
  }
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
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
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
 * Get admin permissions (module keys) for a user
 * Returns empty array if no permissions row exists
 */
export async function getAdminPermissions(userId: string): Promise<AdminModuleKey[]> {
  try {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('modules, is_active')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return []
    }

    // Deactivated admins get no permissions
    if (!data.is_active) {
      return []
    }

    return (data.modules as AdminModuleKey[]) || []
  } catch {
    return []
  }
}

/**
 * Get admin session with permissions attached
 * Used by admin layout to pass permissions to Sidebar
 */
export async function getAdminSessionWithPermissions(): Promise<AdminSessionWithPermissions | null> {
  const session = await getAdminSession()
  if (!session) return null

  // SUPER_ADMIN bypasses permission checks — no need to query
  if (isSuperAdmin(session.user.role)) {
    // Check if admin is deactivated (SUPER_ADMIN can't be deactivated via permissions table,
    // but we still check for consistency)
    return {
      ...session,
      permissions: [], // SUPER_ADMIN doesn't need a permissions list — they bypass all checks
    }
  }

  // Check is_active separately for ADMIN role
  const { data: permRow } = await supabase
    .from('admin_permissions')
    .select('modules, is_active')
    .eq('user_id', session.user.id)
    .single()

  // If deactivated, reject the session entirely
  if (permRow && !permRow.is_active) {
    return null
  }

  const permissions = permRow ? (permRow.modules as AdminModuleKey[]) || [] : []

  return {
    ...session,
    permissions,
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
 * Progressive bcrypt migration: tries bcrypt.compare first, falls back to plaintext,
 * then re-hashes the password on successful plaintext match.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  try {
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

    // Check if admin is deactivated (for ADMIN role only)
    if (user.role === 'ADMIN') {
      const { data: permRow } = await supabase
        .from('admin_permissions')
        .select('is_active')
        .eq('user_id', user.id)
        .single()

      if (permRow && !permRow.is_active) {
        return null
      }
    }

    let passwordValid = false
    const storedPassword = user.password as string

    // Try bcrypt compare first (hashed passwords start with $2)
    if (storedPassword && storedPassword.startsWith('$2')) {
      passwordValid = await bcrypt.compare(password, storedPassword)
    } else {
      // Plaintext fallback
      passwordValid = storedPassword === password

      // Progressive migration: re-hash on successful plaintext login
      if (passwordValid) {
        const hashed = await hashPassword(password)
        await supabase
          .from('User')
          .update({ password: hashed })
          .eq('id', user.id)
      }
    }

    if (!passwordValid) {
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
  details?: Record<string, unknown>
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
 * Throws AdminAuthError if not admin
 */
export async function requireAdmin(): Promise<AdminUser> {
  const session = await getAdminSession()

  if (!session) {
    throw new AdminAuthError('Unauthorized: Admin access required', 401)
  }

  return session.user
}

/**
 * Require super admin access (use in API routes)
 * Throws AdminAuthError if not super admin
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const session = await getAdminSession()

  if (!session) {
    throw new AdminAuthError('Unauthorized: Admin access required', 401)
  }

  if (!isSuperAdmin(session.user.role)) {
    throw new AdminAuthError('Forbidden: Super admin access required', 403)
  }

  return session.user
}

/**
 * Require access to ANY of the given modules.
 * SUPER_ADMIN bypasses all checks. ADMIN must have at least one of the modules in their permissions.
 * Throws AdminAuthError with 401 (not logged in) or 403 (no permission).
 */
export async function requireAnyModuleAccess(moduleKeys: AdminModuleKey[]): Promise<AdminUser> {
  const session = await getAdminSession()

  if (!session) {
    throw new AdminAuthError('Unauthorized: Admin access required', 401)
  }

  if (isSuperAdmin(session.user.role)) {
    return session.user
  }

  const permissions = await getAdminPermissions(session.user.id)

  if (!moduleKeys.some((key) => permissions.includes(key))) {
    throw new AdminAuthError(`Forbidden: No access to ${moduleKeys.join(' or ')} module`, 403)
  }

  return session.user
}

/**
 * Require module-level access for an API route
 * SUPER_ADMIN bypasses all checks. ADMIN must have the module in their permissions.
 * Throws AdminAuthError with 401 (not logged in) or 403 (no permission).
 */
export async function requireModuleAccess(moduleKey: AdminModuleKey): Promise<AdminUser> {
  const session = await getAdminSession()

  if (!session) {
    throw new AdminAuthError('Unauthorized: Admin access required', 401)
  }

  // SUPER_ADMIN bypasses all module checks
  if (isSuperAdmin(session.user.role)) {
    return session.user
  }

  // Check admin permissions from DB
  const permissions = await getAdminPermissions(session.user.id)

  if (!permissions.includes(moduleKey)) {
    throw new AdminAuthError(`Forbidden: No access to ${moduleKey} module`, 403)
  }

  return session.user
}
