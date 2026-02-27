import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateCardNumber, getCardTypeConfigs } from '@/lib/signature-card'
import { paystationClient } from '@/lib/paystation'
import type { SignatureCardCategory } from '@/types/signature-card'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, category, cardholderName, email, phone, mailingAddress, dateOfBirth, weddingAnniversary } = body

    if (!userId || !category || !cardholderName || !email || !phone || !mailingAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validCategories: SignatureCardCategory[] = ['CROWN', 'PRIVILEGE', 'CAMPUS']
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid card category' }, { status: 400 })
    }

    const cardTypes = await getCardTypeConfigs()
    const cardType = cardTypes.find((t) => t.category === category)
    if (!cardType) {
      return NextResponse.json({ error: 'Card type configuration not found' }, { status: 500 })
    }

    const supabase = await createServerClient()

    // Verify user exists
    const { data: user } = await supabase
      .from('User')
      .select('id, name, email')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate unique card number with collision retry
    let cardNumber = generateCardNumber()
    let retries = 0
    while (retries < 5) {
      const { data: existing } = await supabase
        .from('SignatureCard')
        .select('id')
        .eq('cardNumber', cardNumber)
        .single()

      if (!existing) break
      cardNumber = generateCardNumber()
      retries++
    }

    // Create inactive card
    const cardId = crypto.randomUUID()
    const { error: insertError } = await supabase
      .from('SignatureCard')
      .insert({
        id: cardId,
        userId,
        category,
        cardNumber,
        cardholderName,
        balance: 0,
        purchasePrice: cardType.price,
        isActive: false,
        mailingAddress,
        physicalCardStatus: 'PENDING',
        email,
        phone,
        dateOfBirth: dateOfBirth || null,
        weddingAnniversary: weddingAnniversary || null,
      })

    if (insertError) {
      console.error('Failed to create signature card:', insertError)
      return NextResponse.json({ error: 'Failed to create card' }, { status: 500 })
    }

    // Create PayStation invoice — use full cardId for reliable callback lookup
    const timestamp = Date.now()
    const invoiceNumber = `SIGCARD-${cardId}-${cardType.price}-${timestamp}`

    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const callbackUrl = `${baseUrl}/api/signature-card/purchase/callback`

    if (isSandbox) {
      const mockPaymentUrl = new URL('/paystation/payment', baseUrl)
      mockPaymentUrl.searchParams.set('invoice_number', invoiceNumber)
      mockPaymentUrl.searchParams.set('amount', cardType.price.toString())
      mockPaymentUrl.searchParams.set('merchant_id', process.env.PAYSTATION_MERCHANT_ID || 'SANDBOX')
      mockPaymentUrl.searchParams.set('customer_name', cardholderName)
      mockPaymentUrl.searchParams.set('customer_email', email)
      mockPaymentUrl.searchParams.set('customer_phone', phone)
      mockPaymentUrl.searchParams.set('callback_url', '/api/signature-card/purchase/callback')

      return NextResponse.json({
        success: true,
        paymentUrl: mockPaymentUrl.toString(),
        cardId,
      })
    }

    // Production mode
    const paymentResult = await paystationClient.initiatePayment({
      orderNumber: invoiceNumber,
      amount: cardType.price,
      customerName: cardholderName,
      customerEmail: email,
      customerPhone: phone,
      reference: `SIGCARD-${cardId}`,
      callbackUrl,
    })

    if (paymentResult.status !== 'success' || !paymentResult.payment_url) {
      // Clean up the inactive card
      await supabase.from('SignatureCard').delete().eq('id', cardId)
      return NextResponse.json(
        { error: paymentResult.message || 'Payment initiation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.payment_url,
      cardId,
    })
  } catch (error) {
    console.error('Signature card purchase initiate error:', error)
    return NextResponse.json({ error: 'Failed to initiate purchase' }, { status: 500 })
  }
}
