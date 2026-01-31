import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { createRefund } from '@/lib/accounts'
import type { RefundStatus } from '@/types/accounts'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as RefundStatus | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('Refund')
      .select(`
        *,
        order:Order!Refund_orderId_fkey(
          orderNumber,
          total,
          paymentMethod
        )
      `, { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (status) query = query.eq('status', status)
    if (dateFrom) query = query.gte('createdAt', dateFrom)
    if (dateTo) query = query.lte('createdAt', dateTo + 'T23:59:59')
    if (search) {
      // Search by order number through a subquery isn't directly supported,
      // so we search refund fields
      query = query.or(`reason.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      refunds: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error fetching refunds:', error)
    return NextResponse.json({ error: 'Failed to fetch refunds' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, orderItemId, amount, reason, type, restoreStock, notes } = body

    if (!orderId || !amount || !reason || !type) {
      return NextResponse.json(
        { error: 'Order ID, amount, reason, and type are required' },
        { status: 400 }
      )
    }

    // Validate amount against order total
    const { data: order } = await supabase
      .from('Order')
      .select('total')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (Number(amount) > Number(order.total)) {
      return NextResponse.json(
        { error: 'Refund amount cannot exceed order total' },
        { status: 400 }
      )
    }

    const refund = await createRefund({
      orderId,
      orderItemId,
      amount: Number(amount),
      reason,
      type,
      restoreStock: restoreStock || false,
      notes,
    })

    return NextResponse.json({
      success: true,
      refund,
      message: 'Refund created successfully',
    })
  } catch (error) {
    console.error('Error creating refund:', error)
    return NextResponse.json({ error: 'Failed to create refund' }, { status: 500 })
  }
}
