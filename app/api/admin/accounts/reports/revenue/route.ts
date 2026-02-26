import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    await requireModuleAccess('accounts')

    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const groupBy = searchParams.get('groupBy') || 'day'

    // Get orders within period
    let ordersQuery = supabase
      .from('Order')
      .select('id, orderNumber, total, paymentMethod, status, createdAt')
      .neq('status', 'CANCEL')
      .order('createdAt', { ascending: true })

    if (dateFrom) ordersQuery = ordersQuery.gte('createdAt', dateFrom)
    if (dateTo) ordersQuery = ordersQuery.lte('createdAt', dateTo + 'T23:59:59')

    const { data: orders, error: ordersError } = await ordersQuery

    if (ordersError) throw ordersError

    // Get refunds within period
    let refundsQuery = supabase
      .from('Refund')
      .select('amount, createdAt')
      .eq('status', 'PROCESSED')

    if (dateFrom) refundsQuery = refundsQuery.gte('createdAt', dateFrom)
    if (dateTo) refundsQuery = refundsQuery.lte('createdAt', dateTo + 'T23:59:59')

    const { data: refunds } = await refundsQuery

    // Get vendor payouts within period
    let payoutsQuery = supabase
      .from('VendorPayout')
      .select('payoutAmount, createdAt')
      .eq('status', 'PAID')

    if (dateFrom) payoutsQuery = payoutsQuery.gte('createdAt', dateFrom)
    if (dateTo) payoutsQuery = payoutsQuery.lte('createdAt', dateTo + 'T23:59:59')

    const { data: payouts } = await payoutsQuery

    // Group data
    const getGroupKey = (dateStr: string): string => {
      const date = new Date(dateStr)
      switch (groupBy) {
        case 'week': {
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          return weekStart.toISOString().substring(0, 10)
        }
        case 'month':
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        default: // day
          return dateStr.substring(0, 10)
      }
    }

    const groups: Record<string, {
      orderCount: number; grossRevenue: number; refunds: number;
      netRevenue: number; codCollections: number; vendorPayouts: number
    }> = {}

    const ensureGroup = (key: string) => {
      if (!groups[key]) {
        groups[key] = { orderCount: 0, grossRevenue: 0, refunds: 0, netRevenue: 0, codCollections: 0, vendorPayouts: 0 }
      }
    }

    for (const order of orders || []) {
      const key = getGroupKey(order.createdAt)
      ensureGroup(key)
      groups[key].orderCount++
      groups[key].grossRevenue += Number(order.total)
      if (order.paymentMethod === 'COD') {
        groups[key].codCollections += Number(order.total)
      }
    }

    for (const refund of refunds || []) {
      const key = getGroupKey(refund.createdAt)
      ensureGroup(key)
      groups[key].refunds += Number(refund.amount)
    }

    for (const payout of payouts || []) {
      const key = getGroupKey(payout.createdAt)
      ensureGroup(key)
      groups[key].vendorPayouts += Number(payout.payoutAmount)
    }

    // Calculate net revenue
    for (const key of Object.keys(groups)) {
      groups[key].netRevenue = groups[key].grossRevenue - groups[key].refunds - groups[key].vendorPayouts
    }

    const rows = Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data }))

    // Totals
    const totals = rows.reduce(
      (acc, row) => ({
        orderCount: acc.orderCount + row.orderCount,
        grossRevenue: acc.grossRevenue + row.grossRevenue,
        refunds: acc.refunds + row.refunds,
        netRevenue: acc.netRevenue + row.netRevenue,
        codCollections: acc.codCollections + row.codCollections,
        vendorPayouts: acc.vendorPayouts + row.vendorPayouts,
      }),
      { orderCount: 0, grossRevenue: 0, refunds: 0, netRevenue: 0, codCollections: 0, vendorPayouts: 0 }
    )

    return NextResponse.json({ rows, totals })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error generating revenue report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
