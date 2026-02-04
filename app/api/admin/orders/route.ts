import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import type { OrderStatus, PaymentMethod, PaymentStatus } from '@/types/order'

/**
 * GET /api/admin/orders
 * List all orders with filtering and sorting
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as OrderStatus | null
    const paymentMethod = searchParams.get('paymentMethod') as PaymentMethod | null
    const paymentStatus = searchParams.get('paymentStatus') as PaymentStatus | null
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query - select orders with user and address info
    let query = supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        total,
        status,
        paymentMethod,
        paymentStatus,
        createdAt,
        userId,
        shippingAddressId,
        User:userId (
          name,
          email
        ),
        Address:shippingAddressId (
          city,
          fullName
        ),
        OrderItem (
          id
        )
      `, { count: 'exact' })

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    // Apply payment method filter
    if (paymentMethod) {
      query = query.eq('paymentMethod', paymentMethod)
    }

    // Apply payment status filter
    if (paymentStatus) {
      query = query.eq('paymentStatus', paymentStatus)
    }

    // Apply search filter (order number)
    if (search) {
      query = query.ilike('orderNumber', `%${search}%`)
    }

    // Apply date range filters
    if (dateFrom) {
      query = query.gte('createdAt', dateFrom)
    }
    if (dateTo) {
      // Add one day to include the end date
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      query = query.lt('createdAt', endDate.toISOString())
    }

    // Apply sorting
    const ascending = order === 'asc'
    if (sort === 'total') {
      query = query.order('total', { ascending })
    } else if (sort === 'orderNumber') {
      query = query.order('orderNumber', { ascending })
    } else {
      query = query.order('createdAt', { ascending })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: orders, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Transform the data to match AdminOrderListItem interface
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod || 'COD',
      paymentStatus: order.paymentStatus || 'UNPAID',
      createdAt: order.createdAt,
      user: {
        name: (order.User as any)?.name || null,
        email: (order.User as any)?.email || 'Unknown'
      },
      shippingAddress: {
        city: (order.Address as any)?.city || 'Unknown',
        fullName: (order.Address as any)?.fullName || 'Unknown'
      },
      itemCount: order.OrderItem?.length || 0
    })) || []

    return NextResponse.json({
      orders: transformedOrders,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
