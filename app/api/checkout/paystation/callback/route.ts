import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { paystationClient } from '@/lib/paystation'
import { decrementStockWithLog } from '@/lib/inventory'
import { sendPaymentReceivedEmail } from '@/lib/email'

async function handleCallback(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ''

  try {
    // Log the full callback URL for debugging
    console.log('[PayStation Callback] Full URL:', request.nextUrl.toString())
    console.log('[PayStation Callback] Method:', request.method)

    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      console.warn(
        '[PayStation Callback] WARNING: NEXT_PUBLIC_APP_URL is set to localhost (' + appUrl + '). ' +
        'Post-payment redirects will fail for real users. Set it to your production domain.'
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const invoiceNumber = searchParams.get('invoice_number')
    const trxId = searchParams.get('trx_id') || searchParams.get('transaction_id')

    // Log all callback parameters
    console.log('[PayStation Callback] Params:', {
      status,
      invoiceNumber,
      trxId,
      allParams: Object.fromEntries(searchParams.entries()),
    })

    // Validate required parameters
    if (!status || !invoiceNumber) {
      console.error('[PayStation Callback] Missing required params. status:', status, 'invoiceNumber:', invoiceNumber)
      return NextResponse.redirect(
        `${appUrl}/checkout?payment=error`
      )
    }

    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    const paymentMethod = searchParams.get('payment_method')

    let verifiedStatus = status
    let verifiedTrxId = trxId || `UNVERIFIED-${Date.now()}`
    let paymentChannel: string | null = paymentMethod || null

    if (isSandbox) {
      console.log('[PayStation Callback] DEV MODE - Skipping server-side verification')
      verifiedStatus = status
    } else {
      // Production mode: server-side verification
      console.log('[PayStation Callback] Production mode - Verifying transaction:', invoiceNumber)

      try {
        const verification = await paystationClient.verifyTransaction(invoiceNumber)

        console.log('[PayStation Callback] Verification result:', JSON.stringify(verification))

        if (!verification.success || !verification.data) {
          console.error('[PayStation Callback] Verification FAILED:', verification.error)
          // Verification failed, but the callback status might still be valid
          // Log it but fall through to use the callback status
          console.log('[PayStation Callback] Falling back to callback status:', status)
          verifiedStatus = status
        } else {
          verifiedStatus = verification.data.trx_status
          verifiedTrxId = verification.data.trx_id
          paymentChannel = verification.data.payment_method || paymentChannel
          console.log('[PayStation Callback] Verified status:', verifiedStatus, 'trxId:', verifiedTrxId)
        }
      } catch (verifyError) {
        console.error('[PayStation Callback] Verification threw error:', verifyError)
        // If verification API is down, trust the callback params rather than failing the payment
        console.log('[PayStation Callback] Falling back to callback status:', status)
        verifiedStatus = status
      }
    }

    // Check if payment was actually successful
    // PayStation may send "Success", "success", or "Successful"
    const isSuccess = verifiedStatus?.toLowerCase().includes('success')
    console.log('[PayStation Callback] isSuccess:', isSuccess, 'verifiedStatus:', verifiedStatus)

    if (!isSuccess) {
      const failSupabase = await createServerClient()
      const { data: failedOrder } = await failSupabase
        .from('Order')
        .select('id')
        .eq('orderNumber', invoiceNumber)
        .single()

      if (failedOrder) {
        await failSupabase
          .from('Order')
          .update({
            paymentStatus: 'FAILED',
            updatedAt: new Date().toISOString(),
          })
          .eq('id', failedOrder.id)
      }

      return NextResponse.redirect(
        `${appUrl}/checkout?payment=failed`
      )
    }

    const supabase = await createServerClient()

    // Get order by order number
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
      console.error('[PayStation Callback] Order not found:', invoiceNumber, orderError)
      return NextResponse.redirect(
        `${appUrl}/checkout?payment=error`
      )
    }

    // Check if already processed (idempotency)
    if (order.status === 'CONFIRM' || order.status === 'DELIVERED') {
      return NextResponse.redirect(
        `${appUrl}/orders/${order.orderNumber}/confirmation?clearCart=true`
      )
    }

    // Update order status to CONFIRM with payment confirmation
    const { error: updateError } = await supabase
      .from('Order')
      .update({
        status: 'CONFIRM',
        paymentStatus: 'PAID',
        paymentChannel: paymentChannel,
        paystationTransactionId: verifiedTrxId,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('[PayStation Callback] Failed to update order status:', updateError)
      throw new Error('Failed to update order')
    }

    console.log('[PayStation Callback] Order updated successfully:', order.orderNumber)

    // Decrement stock
    const itemsWithVariants = order.OrderItem
      .filter((item: { variantId: string }) => item.variantId && !item.variantId.endsWith('-default'))
      .map((item: { variantId: string; quantity: number }) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }))

    if (itemsWithVariants.length > 0) {
      try {
        await decrementStockWithLog(itemsWithVariants, 'SALE', order.id)
      } catch (stockError) {
        console.error('[PayStation Callback] Stock decrement failed:', stockError)
      }
    }

    // Send payment confirmation email
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
      console.error('[PayStation Callback] Email sending failed:', emailError)
    }

    // Redirect to confirmation page
    return NextResponse.redirect(
      `${appUrl}/orders/${order.orderNumber}/confirmation?clearCart=true`
    )
  } catch (error) {
    console.error('[PayStation Callback] Unhandled error:', error)
    return NextResponse.redirect(
      `${appUrl}/checkout?payment=error`
    )
  }
}

// Handle both GET and POST — PayStation may use either method
export async function GET(request: NextRequest) {
  return handleCallback(request)
}

export async function POST(request: NextRequest) {
  return handleCallback(request)
}
