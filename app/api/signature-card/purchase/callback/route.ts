import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { activateCard } from '@/lib/signature-card'
import { sendSignatureCardWelcomeEmail } from '@/lib/email'
import { paystationClient } from '@/lib/paystation'

async function handleCallback(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    // Support both GET (query params) and POST (form body)
    let status: string | null = null
    let invoiceNumber: string | null = null
    let trxId: string | null = null

    if (request.method === 'GET') {
      const searchParams = request.nextUrl.searchParams
      status = searchParams.get('status')
      invoiceNumber = searchParams.get('invoice_number')
      trxId = searchParams.get('trx_id') || searchParams.get('transaction_id')
    } else {
      try {
        const formData = await request.formData()
        status = formData.get('status') as string | null
        invoiceNumber = formData.get('invoice_number') as string | null
        trxId = (formData.get('trx_id') || formData.get('transaction_id')) as string | null
      } catch {
        const body = await request.json().catch(() => ({}))
        status = body.status || null
        invoiceNumber = body.invoice_number || null
        trxId = body.trx_id || body.transaction_id || null
      }
    }

    if (!status || !invoiceNumber) {
      console.error('Signature card callback: missing status or invoice_number')
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Parse invoice: SIGCARD-{cardId(uuid)}-{price}-{timestamp}
    // UUID has format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (5 segments)
    // So full invoice splits as: SIGCARD, then 5 UUID segments, then price, then timestamp = 8 parts
    if (!invoiceNumber.startsWith('SIGCARD-')) {
      console.error('Signature card callback: invalid invoice format:', invoiceNumber)
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Extract cardId (UUID) from between first "SIGCARD-" and the price-timestamp suffix
    // Format: SIGCARD-{uuid}-{price}-{timestamp}
    const withoutPrefix = invoiceNumber.slice('SIGCARD-'.length) // uuid-price-timestamp
    // UUID is 36 chars (8-4-4-4-12), so extract it directly
    const cardId = withoutPrefix.slice(0, 36)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(cardId)) {
      console.error('Signature card callback: invalid card ID in invoice:', invoiceNumber)
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Server-side verification
    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    let verifiedStatus = status
    let verifiedTrxId = trxId || `MOCK-${Date.now()}`

    if (!isSandbox) {
      const verification = await paystationClient.verifyTransaction(invoiceNumber)
      if (!verification.success || !verification.data) {
        return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
      }
      verifiedStatus = verification.data.trx_status
      verifiedTrxId = verification.data.trx_id
    }

    if (verifiedStatus !== 'Success') {
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=failed`)
    }

    // Find the card by exact ID
    const supabase = await createServerClient()
    const { data: card } = await supabase
      .from('SignatureCard')
      .select('*')
      .eq('id', cardId)
      .eq('isActive', false)
      .single()

    if (!card) {
      // Card might already be activated (idempotency)
      const { data: activeCard } = await supabase
        .from('SignatureCard')
        .select('id')
        .eq('id', cardId)
        .eq('isActive', true)
        .single()

      if (activeCard) {
        return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=success`)
      }

      console.error('Signature card callback: card not found for id:', cardId)
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Idempotency: check if trxId already used
    const { data: existingTx } = await supabase
      .from('CardTransaction')
      .select('id')
      .eq('paystationTrxId', verifiedTrxId)
      .single()

    if (existingTx) {
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=success`)
    }

    // Activate the card
    await activateCard(card.id, verifiedTrxId)

    // Send welcome email
    const { data: activatedCard } = await supabase
      .from('SignatureCard')
      .select('*')
      .eq('id', card.id)
      .single()

    if (activatedCard) {
      sendSignatureCardWelcomeEmail(activatedCard, activatedCard.email).catch((err) =>
        console.error('Failed to send welcome email:', err)
      )
    }

    return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=success`)
  } catch (error) {
    console.error('Signature card purchase callback error:', error)
    return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
  }
}

export async function GET(request: NextRequest) {
  return handleCallback(request)
}

export async function POST(request: NextRequest) {
  return handleCallback(request)
}
