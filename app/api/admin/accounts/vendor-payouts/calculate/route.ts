import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { calculateVendorEarnings } from '@/lib/accounts'

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vendorId, periodStart, periodEnd } = body

    if (!vendorId || !periodStart || !periodEnd) {
      return NextResponse.json(
        { error: 'Vendor ID, period start, and period end are required' },
        { status: 400 }
      )
    }

    const earnings = await calculateVendorEarnings(vendorId, periodStart, periodEnd)

    return NextResponse.json({
      success: true,
      earnings,
    })
  } catch (error) {
    console.error('Error calculating vendor earnings:', error)
    return NextResponse.json(
      { error: 'Failed to calculate vendor earnings' },
      { status: 500 }
    )
  }
}
