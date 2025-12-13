/**
 * Admin Logout API Route
 * POST /api/admin/logout
 */

import { NextResponse } from 'next/server'
import { getAdminSession, clearAdminSession, logAdminAction } from '@/lib/admin-auth'

export async function POST() {
  try {
    // Get current session before clearing
    const session = await getAdminSession()

    if (session) {
      // Log admin logout
      await logAdminAction(session.user.id, 'LOGOUT', 'AUTH', session.user.id, {
        email: session.user.email,
        timestamp: new Date().toISOString(),
      })
    }

    // Clear admin session
    await clearAdminSession()

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
