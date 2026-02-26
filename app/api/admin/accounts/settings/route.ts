import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    await requireModuleAccess('accounts')

    // Get default commission rate (from first vendor or default)
    const { data: vendors } = await supabase
      .from('Vendor')
      .select('commissionRate')
      .limit(1)

    const defaultRate = vendors?.[0]?.commissionRate || 10

    return NextResponse.json({
      settings: {
        defaultCommissionRate: Number(defaultRate),
      },
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireModuleAccess('accounts')

    const body = await request.json()
    const { defaultCommissionRate } = body

    if (defaultCommissionRate !== undefined) {
      const rate = Number(defaultCommissionRate)
      if (rate < 0 || rate > 100) {
        return NextResponse.json(
          { error: 'Commission rate must be between 0 and 100' },
          { status: 400 }
        )
      }

      // Update all vendors that don't have a custom rate
      const { error } = await supabase
        .from('Vendor')
        .update({ commissionRate: rate })
        .is('commissionRate', null)

      if (error) {
        // If no rows match IS NULL, update all
        await supabase
          .from('Vendor')
          .update({ commissionRate: rate })
          .gte('id', '00000000-0000-0000-0000-000000000000')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
