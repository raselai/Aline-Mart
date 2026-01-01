import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params

    const supabase = await createServerClient()

    const { data: order, error } = await supabase
      .from('Order')
      .select(`
        *,
        OrderItem(*),
        Address(*),
        User(name, email)
      `)
      .eq('orderNumber', orderNumber)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      order: {
        ...order,
        items: order.OrderItem,
        shippingAddress: order.Address,
        user: order.User,
      },
    })
  } catch (error) {
    console.error('Fetch order error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
