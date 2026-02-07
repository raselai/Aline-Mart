import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const periodDate = new Date()
    periodDate.setDate(periodDate.getDate() - parseInt(period))
    const periodStr = periodDate.toISOString()

    // Fetch all transactions for the period
    const { data: transactions } = await supabase
      .from('Transaction')
      .select('type, amount, createdAt')
      .gte('createdAt', periodStr)
      .order('createdAt', { ascending: true })

    // Calculate totals
    let totalRevenue = 0
    let totalRefunds = 0
    let totalPayouts = 0

    for (const tx of transactions || []) {
      const amount = Number(tx.amount)
      switch (tx.type) {
        case 'SALE': totalRevenue += amount; break
        case 'COD_COLLECTION': totalRevenue += amount; break
        case 'REFUND': totalRefunds += amount; break
        case 'VENDOR_PAYOUT': totalPayouts += amount; break
      }
    }

    const netRevenue = totalRevenue - totalRefunds - totalPayouts

    // Revenue by day
    const revenueByDay: Record<string, number> = {}
    for (const tx of transactions || []) {
      if (tx.type === 'SALE' || tx.type === 'COD_COLLECTION') {
        const day = tx.createdAt.substring(0, 10)
        revenueByDay[day] = (revenueByDay[day] || 0) + Number(tx.amount)
      }
    }

    const revenueByPeriod = Object.entries(revenueByDay).map(([date, amount]) => ({
      date,
      amount,
    }))

    // Revenue by payment method (from orders)
    const { data: orders } = await supabase
      .from('Order')
      .select('paymentMethod, total')
      .gte('createdAt', periodStr)
      .neq('status', 'CANCEL')

    const paymentMethodMap: Record<string, { amount: number; count: number }> = {}
    for (const order of orders || []) {
      const method = order.paymentMethod || 'Unknown'
      if (!paymentMethodMap[method]) {
        paymentMethodMap[method] = { amount: 0, count: 0 }
      }
      paymentMethodMap[method].amount += Number(order.total)
      paymentMethodMap[method].count++
    }

    const revenueByPaymentMethod = Object.entries(paymentMethodMap).map(
      ([method, data]) => ({ method, ...data })
    )

    // Pending counts
    const { count: pendingCOD } = await supabase
      .from('CODCollection')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    const { count: pendingRefunds } = await supabase
      .from('Refund')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    const { count: pendingPayouts } = await supabase
      .from('VendorPayout')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING')

    // Pending COD amount
    const { data: pendingCODData } = await supabase
      .from('CODCollection')
      .select('expectedAmount')
      .eq('status', 'PENDING')

    const pendingCODAmount = (pendingCODData || []).reduce(
      (sum, c) => sum + Number(c.expectedAmount), 0
    )

    // Recent transactions
    const { data: recentTransactions } = await supabase
      .from('Transaction')
      .select(`
        *,
        order:Order!Transaction_orderId_fkey(orderNumber)
      `)
      .order('createdAt', { ascending: false })
      .limit(10)

    return NextResponse.json({
      stats: {
        totalRevenue,
        netRevenue,
        totalRefunds,
        totalPayouts,
        pendingCOD: pendingCODAmount,
        pendingCounts: {
          codCollections: pendingCOD || 0,
          refunds: pendingRefunds || 0,
          vendorPayouts: pendingPayouts || 0,
        },
        revenueByPeriod,
        revenueByPaymentMethod,
      },
      recentTransactions: recentTransactions || [],
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
