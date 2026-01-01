import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { paystationClient } from '@/lib/paystation'

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .select(`
        *,
        User(name, email),
        Address(phone)
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Verify order is pending and uses PayStation
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Order is not pending' },
        { status: 400 }
      )
    }

    if (order.paymentMethod !== 'PAYSTATION') {
      return NextResponse.json(
        { error: 'Order does not use PayStation' },
        { status: 400 }
      )
    }

    // Check if in sandbox/development mode
    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (isSandbox) {
      // In sandbox mode, redirect to our mock PayStation page
      const mockPaymentUrl = new URL('/paystation/payment', baseUrl)
      mockPaymentUrl.searchParams.set('invoice_number', order.orderNumber)
      mockPaymentUrl.searchParams.set('amount', order.total.toString())
      mockPaymentUrl.searchParams.set('merchant_id', process.env.PAYSTATION_MERCHANT_ID || 'SANDBOX')
      mockPaymentUrl.searchParams.set('customer_name', order.User.name)
      mockPaymentUrl.searchParams.set('customer_email', order.User.email)
      mockPaymentUrl.searchParams.set('customer_phone', order.Address.phone)

      return NextResponse.json({
        success: true,
        paymentUrl: mockPaymentUrl.toString(),
      })
    }

    // Production mode: Use real PayStation API
    const paymentResult = await paystationClient.initiatePayment({
      orderNumber: order.orderNumber,
      amount: order.total,
      customerName: order.User.name,
      customerEmail: order.User.email,
      customerPhone: order.Address.phone,
      description: `Order ${order.orderNumber} - Aline Mart`,
    })

    if (!paymentResult.success || !paymentResult.data) {
      return NextResponse.json(
        { error: paymentResult.error || 'Payment initiation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.data.payment_url,
    })
  } catch (error) {
    console.error('PayStation initiate error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}
