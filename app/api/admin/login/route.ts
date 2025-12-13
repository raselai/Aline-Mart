/**
 * Admin Login API Route
 * POST /api/admin/login
 */

import { NextResponse } from 'next/server'
import { verifyAdminCredentials, createAdminSession, logAdminAction } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Verify admin credentials
    const user = await verifyAdminCredentials(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password, or account does not have admin access' },
        { status: 401 }
      )
    }

    // Create admin session
    await createAdminSession(user)

    // Log admin login
    await logAdminAction(user.id, 'LOGIN', 'AUTH', user.id, {
      email: user.email,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
