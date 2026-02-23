import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { addBalance } from '@/lib/virtual-card'
import { paystationClient } from '@/lib/paystation'

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const invoiceNumber = searchParams.get('invoice_number')
    const trxId = searchParams.get('trx_id') || searchParams.get('transaction_id')

    if (!status || !invoiceNumber) {
      return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=error`)
    }

    // Parse invoice: VCTOP-{shortCardId}-{amount}-{timestamp}
    const parts = invoiceNumber.split('-')
    if (parts.length < 4 || parts[0] !== 'VCTOP') {
      return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=error`)
    }

    const shortCardId = parts[1]
    const topupAmount = Number(parts[2])

    if (!topupAmount || topupAmount < 1000) {
      return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=error`)
    }

    // Server-side verification
    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    let verifiedStatus = status
    let verifiedTrxId = trxId || `MOCK-${Date.now()}`

    if (!isSandbox) {
      const verification = await paystationClient.verifyTransaction(invoiceNumber)
      if (!verification.success || !verification.data) {
        return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=error`)
      }
      verifiedStatus = verification.data.trx_status
      verifiedTrxId = verification.data.trx_id
    }

    if (verifiedStatus !== 'Success') {
      return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=failed`)
    }

    // Find the card by matching the short ID prefix
    const supabase = await createServerClient()
    const { data: cards } = await supabase
      .from('VirtualCard')
      .select('id')
      .like('id', `${shortCardId}%`)
      .limit(1)

    if (!cards || cards.length === 0) {
      return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=error`)
    }

    const cardId = cards[0].id

    // Idempotency: check if this trxId was already processed
    const { data: existingTx } = await supabase
      .from('VirtualCardTransaction')
      .select('id')
      .eq('paystationTrxId', verifiedTrxId)
      .single()

    if (existingTx) {
      return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=success`)
    }

    // Credit the card balance and recalculate tier
    await addBalance(cardId, topupAmount, verifiedTrxId, `Top-up ৳${topupAmount.toLocaleString()}`)

    return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=success`)
  } catch (error) {
    console.error('Virtual card top-up callback error:', error)
    return NextResponse.redirect(`${baseUrl}/account/virtual-card?topup=error`)
  }
}
