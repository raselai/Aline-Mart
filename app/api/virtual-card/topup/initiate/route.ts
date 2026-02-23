import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateCardNumber } from '@/lib/virtual-card'
import { paystationClient } from '@/lib/paystation'

const MIN_TOPUP_AMOUNT = 1000

export async function POST(request: NextRequest) {
  try {
    const { email, amount } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const topupAmount = Number(amount)
    if (!topupAmount || topupAmount < MIN_TOPUP_AMOUNT) {
      return NextResponse.json(
        { error: `Minimum top-up amount is ৳${MIN_TOPUP_AMOUNT.toLocaleString()}` },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Get user
    const { data: user } = await supabase
      .from('User')
      .select('id, name, email')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Ensure card exists (auto-create if not)
    let card = await supabase
      .from('VirtualCard')
      .select('id')
      .eq('userId', user.id)
      .single()
      .then((r) => r.data)

    if (!card) {
      const { data: newCard, error: createError } = await supabase
        .from('VirtualCard')
        .insert({
          userId: user.id,
          cardNumber: generateCardNumber(),
          balance: 0,
          lifetimeLoaded: 0,
          tierLevel: 'STANDARD',
          discountPercent: 0,
        })
        .select('id')
        .single()

      if (createError || !newCard) {
        throw new Error('Failed to create virtual card')
      }
      card = newCard
    }

    // Encode cardId, amount in invoice for callback to parse
    const shortCardId = card.id.slice(0, 8)
    const timestamp = Date.now()
    const invoiceNumber = `VCTOP-${shortCardId}-${topupAmount}-${timestamp}`

    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/api/virtual-card/topup/callback`

    if (isSandbox) {
      // Sandbox mode: redirect to mock PayStation page with custom callback
      const mockPaymentUrl = new URL('/paystation/payment', baseUrl)
      mockPaymentUrl.searchParams.set('invoice_number', invoiceNumber)
      mockPaymentUrl.searchParams.set('amount', topupAmount.toString())
      mockPaymentUrl.searchParams.set('merchant_id', process.env.PAYSTATION_MERCHANT_ID || 'SANDBOX')
      mockPaymentUrl.searchParams.set('customer_name', user.name || 'Customer')
      mockPaymentUrl.searchParams.set('customer_email', user.email)
      mockPaymentUrl.searchParams.set('customer_phone', '01700000000')
      mockPaymentUrl.searchParams.set('callback_url', '/api/virtual-card/topup/callback')

      return NextResponse.json({
        success: true,
        paymentUrl: mockPaymentUrl.toString(),
      })
    }

    // Production mode: real PayStation
    const paymentResult = await paystationClient.initiatePayment({
      orderNumber: invoiceNumber,
      amount: topupAmount,
      customerName: user.name || 'Customer',
      customerEmail: user.email,
      customerPhone: '01700000000',
      reference: `VCTOP-${card.id}`,
      callbackUrl,
    })

    if (paymentResult.status !== 'success' || !paymentResult.payment_url) {
      return NextResponse.json(
        { error: paymentResult.message || 'Payment initiation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.payment_url,
    })
  } catch (error) {
    console.error('Virtual card top-up initiate error:', error)
    return NextResponse.json({ error: 'Failed to initiate top-up' }, { status: 500 })
  }
}
