import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import { createVendorPayout } from '@/lib/accounts'
import type { PayoutStatus } from '@/types/accounts'

export async function GET(request: Request) {
  try {
    await requireModuleAccess('accounts')

    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const status = searchParams.get('status') as PayoutStatus | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('VendorPayout')
      .select(`
        *,
        vendor:Vendor!VendorPayout_vendorId_fkey(
          shopName,
          ownerName,
          email,
          bankName,
          accountNumber
        )
      `, { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (vendorId) query = query.eq('vendorId', vendorId)
    if (status) query = query.eq('status', status)
    if (dateFrom) query = query.gte('periodStart', dateFrom)
    if (dateTo) query = query.lte('periodEnd', dateTo)

    const { data, error, count } = await query

    if (error) throw error

    // Get pending payouts total
    const { data: pendingData } = await supabase
      .from('VendorPayout')
      .select('payoutAmount')
      .eq('status', 'PENDING')

    const pendingTotal = (pendingData || []).reduce(
      (sum, p) => sum + Number(p.payoutAmount), 0
    )

    return NextResponse.json({
      payouts: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      pendingTotal,
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching vendor payouts:', error)
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireModuleAccess('accounts')

    const body = await request.json()
    const { vendorId, periodStart, periodEnd, totalSales, commissionRate, commissionAmount, payoutAmount } = body

    if (!vendorId || !periodStart || !periodEnd) {
      return NextResponse.json(
        { error: 'Vendor ID, period start, and period end are required' },
        { status: 400 }
      )
    }

    const payout = await createVendorPayout({
      vendorId,
      periodStart,
      periodEnd,
      totalSales: Number(totalSales),
      commissionRate: Number(commissionRate),
      commissionAmount: Number(commissionAmount),
      payoutAmount: Number(payoutAmount),
    })

    return NextResponse.json({
      success: true,
      payout,
      message: 'Vendor payout created successfully',
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error creating vendor payout:', error)
    return NextResponse.json({ error: 'Failed to create payout' }, { status: 500 })
  }
}
