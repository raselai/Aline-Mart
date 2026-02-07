import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import type { OrderStatus, ShippingStatus, PaymentMethod } from '@/types/order'

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
  const dataLines = rows.map((row) => headers.map((header) => escapeCsvField(row[header])).join(','))
  return [headerLine, ...dataLines].join('\n')
}

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as OrderStatus | null
    const shippingStatus = searchParams.get('shippingStatus') as ShippingStatus | null
    const paymentMethod = searchParams.get('paymentMethod') as PaymentMethod | null
    const search = searchParams.get('search') || ''
    const dateFrom = searchParams.get('dateFrom') || ''
    const dateTo = searchParams.get('dateTo') || ''
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    let query = supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        total,
        status,
        shippingStatus,
        paymentMethod,
        shippingCost,
        createdAt,
        User:userId (
          name,
          email
        ),
        Address:shippingAddressId (
          fullName,
          phone,
          city,
          state,
          country
        ),
        OrderItem (
          subOrderNumber,
          productName,
          brandName,
          variantName,
          quantity,
          price,
          total,
          costPrice
        )
      `)

    if (status) {
      query = query.eq('status', status)
    }

    if (shippingStatus) {
      query = query.eq('shippingStatus', shippingStatus)
    }

    if (paymentMethod) {
      query = query.eq('paymentMethod', paymentMethod)
    }

    if (search) {
      query = query.ilike('orderNumber', `%${search}%`)
    }

    if (dateFrom) {
      query = query.gte('createdAt', dateFrom)
    }

    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      query = query.lt('createdAt', endDate.toISOString())
    }

    const ascending = order === 'asc'
    if (sort === 'total') {
      query = query.order('total', { ascending })
    } else if (sort === 'orderNumber') {
      query = query.order('orderNumber', { ascending })
    } else {
      query = query.order('createdAt', { ascending })
    }

    const { data: orders, error } = await query
    if (error) throw error

    const headers = [
      'orderNumber',
      'orderDate',
      'orderStatus',
      'shippingStatus',
      'paymentMethod',
      'customerName',
      'customerEmail',
      'phone',
      'city',
      'state',
      'country',
      'subOrderNumber',
      'productName',
      'brandName',
      'variantName',
      'quantity',
      'unitPrice',
      'itemTotal',
      'costPrice',
      'itemProfit',
      'shippingCost',
      'orderTotal',
    ]

    const rows: Array<Record<string, string | number | null>> = []

    for (const orderRow of orders || []) {
      const user = Array.isArray(orderRow.User) ? orderRow.User[0] : orderRow.User
      const address = Array.isArray(orderRow.Address) ? orderRow.Address[0] : orderRow.Address
      const items = orderRow.OrderItem || []

      if (items.length === 0) {
        rows.push({
          orderNumber: orderRow.orderNumber,
          orderDate: orderRow.createdAt,
          orderStatus: orderRow.status,
          shippingStatus: orderRow.shippingStatus || 'PROCESSING',
          paymentMethod: orderRow.paymentMethod || 'COD',
          customerName: address?.fullName || user?.name || '',
          customerEmail: user?.email || '',
          phone: address?.phone || '',
          city: address?.city || '',
          state: address?.state || '',
          country: address?.country || '',
          subOrderNumber: '',
          productName: '',
          brandName: '',
          variantName: '',
          quantity: '',
          unitPrice: '',
          itemTotal: '',
          costPrice: '',
          itemProfit: '',
          shippingCost: Number(orderRow.shippingCost || 0),
          orderTotal: Number(orderRow.total || 0),
        })
        continue
      }

      for (const item of items) {
        const unitPrice = Number(item.price || 0)
        const quantity = Number(item.quantity || 0)
        const itemTotal = Number(item.total || unitPrice * quantity)
        const costPrice = item.costPrice !== null && item.costPrice !== undefined
          ? Number(item.costPrice)
          : null
        const itemProfit = costPrice === null ? null : (unitPrice - costPrice) * quantity

        rows.push({
          orderNumber: orderRow.orderNumber,
          orderDate: orderRow.createdAt,
          orderStatus: orderRow.status,
          shippingStatus: orderRow.shippingStatus || 'PROCESSING',
          paymentMethod: orderRow.paymentMethod || 'COD',
          customerName: address?.fullName || user?.name || '',
          customerEmail: user?.email || '',
          phone: address?.phone || '',
          city: address?.city || '',
          state: address?.state || '',
          country: address?.country || '',
          subOrderNumber: item.subOrderNumber || '',
          productName: item.productName || '',
          brandName: item.brandName || '',
          variantName: item.variantName || '',
          quantity,
          unitPrice,
          itemTotal,
          costPrice,
          itemProfit,
          shippingCost: Number(orderRow.shippingCost || 0),
          orderTotal: Number(orderRow.total || 0),
        })
      }
    }

    const csv = arrayToCsv(headers, rows)
    const dateTag = new Date().toISOString().substring(0, 10)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders-export-${dateTag}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting orders:', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}
