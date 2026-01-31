import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'

function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) return ''
  const str = String(field)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function arrayToCsv(headers: string[], rows: Array<Record<string, string | number | null>>): string {
  const headerLine = headers.map(escapeCsvField).join(',')
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeCsvField(row[h])).join(',')
  )
  return [headerLine, ...dataLines].join('\n')
}

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'sales'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    let csv = ''
    let filename = ''

    switch (type) {
      case 'sales': {
        let query = supabase
          .from('Order')
          .select(`
            orderNumber, total, paymentMethod, status, shippingCost, createdAt,
            user:User!Order_userId_fkey(name, email)
          `)
          .order('createdAt', { ascending: false })

        if (dateFrom) query = query.gte('createdAt', dateFrom)
        if (dateTo) query = query.lte('createdAt', dateTo + 'T23:59:59')

        const { data, error } = await query
        if (error) throw error

        const headers = ['orderNumber', 'customerName', 'customerEmail', 'total', 'shippingCost', 'paymentMethod', 'status', 'createdAt']
        const rows = (data || []).map((order) => {
          const user = Array.isArray(order.user) ? order.user[0] : order.user
          return {
            orderNumber: order.orderNumber,
            customerName: user?.name || '',
            customerEmail: user?.email || '',
            total: Number(order.total),
            shippingCost: Number(order.shippingCost),
            paymentMethod: order.paymentMethod,
            status: order.status,
            createdAt: order.createdAt,
          }
        })

        csv = arrayToCsv(headers, rows)
        filename = `sales-report-${new Date().toISOString().substring(0, 10)}.csv`
        break
      }

      case 'refunds': {
        let query = supabase
          .from('Refund')
          .select(`
            amount, reason, status, type, restoreStock, createdAt, processedAt,
            order:Order!Refund_orderId_fkey(orderNumber)
          `)
          .order('createdAt', { ascending: false })

        if (dateFrom) query = query.gte('createdAt', dateFrom)
        if (dateTo) query = query.lte('createdAt', dateTo + 'T23:59:59')

        const { data, error } = await query
        if (error) throw error

        const headers = ['orderNumber', 'amount', 'type', 'reason', 'status', 'restoreStock', 'createdAt', 'processedAt']
        const rows = (data || []).map((refund) => {
          const order = Array.isArray(refund.order) ? refund.order[0] : refund.order
          return {
          orderNumber: order?.orderNumber || '',
          amount: Number(refund.amount),
          type: refund.type,
          reason: refund.reason,
          status: refund.status,
          restoreStock: refund.restoreStock ? 'Yes' : 'No',
          createdAt: refund.createdAt,
          processedAt: refund.processedAt || '',
        }})

        csv = arrayToCsv(headers, rows)
        filename = `refunds-report-${new Date().toISOString().substring(0, 10)}.csv`
        break
      }

      case 'payouts': {
        let query = supabase
          .from('VendorPayout')
          .select(`
            periodStart, periodEnd, totalSales, commissionRate, commissionAmount, payoutAmount, status, reference, paidAt, createdAt,
            vendor:Vendor!VendorPayout_vendorId_fkey(shopName, ownerName)
          `)
          .order('createdAt', { ascending: false })

        if (dateFrom) query = query.gte('createdAt', dateFrom)
        if (dateTo) query = query.lte('createdAt', dateTo + 'T23:59:59')

        const { data, error } = await query
        if (error) throw error

        const headers = ['vendorName', 'ownerName', 'periodStart', 'periodEnd', 'totalSales', 'commissionRate', 'commissionAmount', 'payoutAmount', 'status', 'reference', 'paidAt']
        const rows = (data || []).map((payout) => {
          const vendor = Array.isArray(payout.vendor) ? payout.vendor[0] : payout.vendor
          return {
          vendorName: vendor?.shopName || '',
          ownerName: vendor?.ownerName || '',
          periodStart: payout.periodStart,
          periodEnd: payout.periodEnd,
          totalSales: Number(payout.totalSales),
          commissionRate: Number(payout.commissionRate),
          commissionAmount: Number(payout.commissionAmount),
          payoutAmount: Number(payout.payoutAmount),
          status: payout.status,
          reference: payout.reference || '',
          paidAt: payout.paidAt || '',
        }})

        csv = arrayToCsv(headers, rows)
        filename = `payouts-report-${new Date().toISOString().substring(0, 10)}.csv`
        break
      }

      case 'revenue': {
        let query = supabase
          .from('Transaction')
          .select('type, amount, description, reference, createdAt')
          .order('createdAt', { ascending: false })

        if (dateFrom) query = query.gte('createdAt', dateFrom)
        if (dateTo) query = query.lte('createdAt', dateTo + 'T23:59:59')

        const { data, error } = await query
        if (error) throw error

        const headers = ['type', 'amount', 'description', 'reference', 'createdAt']
        const rows = (data || []).map((tx) => ({
          type: tx.type,
          amount: Number(tx.amount),
          description: tx.description || '',
          reference: tx.reference || '',
          createdAt: tx.createdAt,
        }))

        csv = arrayToCsv(headers, rows)
        filename = `revenue-report-${new Date().toISOString().substring(0, 10)}.csv`
        break
      }

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting report:', error)
    return NextResponse.json({ error: 'Failed to export report' }, { status: 500 })
  }
}
