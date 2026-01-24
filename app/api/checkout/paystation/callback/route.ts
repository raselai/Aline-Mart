import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { paystationClient } from '@/lib/paystation'
import { decrementStockWithLog } from '@/lib/inventory'
import { sendPaymentReceivedEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const invoiceNumber = searchParams.get('invoice_number')
    const trxId = searchParams.get('trx_id') || searchParams.get('transaction_id')
    const amount = searchParams.get('amount')
    const token = searchParams.get('token')
    const paymentMethod = searchParams.get('payment_method')

    // Validate required parameters
    if (!status || !invoiceNumber || !amount || !token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=error`
      )
    }

    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'

    // STEP 1: Verify callback signature (prevent URL tampering)
    if (isSandbox && token === 'mock_signature_for_dev') {
      // In sandbox mode with our mock signature, skip signature verification
      console.log('[DEV MODE] Accepting mock payment callback')
    } else {
      // Production mode: verify real signature
      const params = {
        status,
        invoice_number: invoiceNumber,
        trx_id: trxId || '',
        amount,
      }

      const isValidSignature = paystationClient.verifyCallbackSignature(params, token)
      if (!isValidSignature) {
        console.error('Invalid PayStation callback signature')
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=error`
        )
      }
    }

    // STEP 2: Server-side verification
    let verifiedStatus = status
    let verifiedTrxId = trxId || `MOCK-${Date.now()}`

    if (isSandbox) {
      // In sandbox mode, trust the callback params (only for dev)
      console.log('[DEV MODE] Skipping server-side PayStation verification')
      verifiedStatus = status
    } else {
      // Production mode: MANDATORY server-side verification
      const verification = await paystationClient.verifyTransaction(invoiceNumber)

      if (!verification.success || !verification.data) {
        console.error('PayStation verification failed:', verification.error)
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=error`
        )
      }

      verifiedStatus = verification.data.status
      verifiedTrxId = verification.data.trx_id
    }

    // Check if payment was actually successful
    if (verifiedStatus !== 'Successful') {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=failed`
      )
    }

    const supabase = await createServerClient()

    // STEP 3: Get order by order number
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .select(`
        *,
        OrderItem(*),
        User(email, name),
        Address(*)
      `)
      .eq('orderNumber', invoiceNumber)
      .single()

    if (orderError || !order) {
      console.error('Order not found:', invoiceNumber)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=error`
      )
    }

    // STEP 4: Check if already processed (idempotency)
    if (order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      // Already processed, redirect to confirmation
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.orderNumber}/confirmation?clearCart=true`
      )
    }

    // STEP 5: Update order status to PROCESSING
    const { error: updateError } = await supabase
      .from('Order')
      .update({
        status: 'PROCESSING',
        paystationTransactionId: verifiedTrxId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to update order status:', updateError)
      throw new Error('Failed to update order')
    }

    // STEP 6: Decrement stock (CRITICAL - atomic operation with audit log)
    try {
      await decrementStockWithLog(
        order.OrderItem.map((item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        'SALE',
        order.id
      )
    } catch (stockError) {
      console.error('Stock decrement failed:', stockError)
      // Don't fail the entire flow - log for manual review
      // In production, you might want to trigger an alert here
    }

    // STEP 7: Send payment confirmation email
    try {
      await sendPaymentReceivedEmail(
        {
          ...order,
          shippingAddress: order.Address,
          user: order.User,
        },
        order.User.email
      )
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the flow - email is not critical
    }

    // STEP 8: Redirect to confirmation page with clearCart flag
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.orderNumber}/confirmation?clearCart=true`
    )
  } catch (error) {
    console.error('PayStation callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/checkout?payment=error`
    )
  }
}
