import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/settings - Get all settings
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Fetch all settings from database
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      console.error('Error fetching settings:', error)
      throw error
    }

    // Convert array of settings to key-value object
    const settingsObject: Record<string, any> = {}
    settings?.forEach((setting) => {
      settingsObject[setting.key] = setting.value
    })

    return NextResponse.json({
      settings: settingsObject
    })
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Update multiple settings
export async function PUT(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Parse request body
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      )
    }

    // Update each setting in the database
    const updates = Object.entries(settings).map(async ([key, value]) => {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .single()

      if (existing) {
        // Update existing setting
        return await supabase
          .from('settings')
          .update({ value })
          .eq('key', key)
      } else {
        // Insert new setting
        return await supabase
          .from('settings')
          .insert({ key, value })
      }
    })

    // Wait for all updates to complete
    const results = await Promise.all(updates)

    // Check for errors
    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('Errors updating settings:', errors)
      throw new Error('Failed to update some settings')
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      updated: Object.keys(settings).length
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
