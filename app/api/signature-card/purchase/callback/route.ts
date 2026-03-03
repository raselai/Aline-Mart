import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { activateCard } from '@/lib/signature-card'
import { sendSignatureCardWelcomeEmail } from '@/lib/email'
import { paystationClient } from '@/lib/paystation'

async function handleCallback(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    // Read params from URL query string (PayStation sends params in URL for both GET and POST)
    const searchParams = request.nextUrl.searchParams
    let status: string | null = searchParams.get('status')
    let invoiceNumber: string | null = searchParams.get('invoice_number')
    let trxId: string | null = searchParams.get('trx_id') || searchParams.get('transaction_id')

    // Fallback: for POST requests, also try form body / JSON body if URL params are missing
    if (request.method === 'POST' && (!status || !invoiceNumber)) {
      try {
        const formData = await request.formData()
        status = status || (formData.get('status') as string | null)
        invoiceNumber = invoiceNumber || (formData.get('invoice_number') as string | null)
        trxId = trxId || (formData.get('trx_id') || formData.get('transaction_id')) as string | null
      } catch {
        const body = await request.json().catch(() => ({}))
        status = status || body.status || null
        invoiceNumber = invoiceNumber || body.invoice_number || null
        trxId = trxId || body.trx_id || body.transaction_id || null
      }
    }

    console.log('[Signature Card Callback] Method:', request.method, 'Params:', { status, invoiceNumber, trxId })

    if (!status || !invoiceNumber) {
      console.error('[Signature Card Callback] Missing status or invoice_number')
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Parse invoice: SIGCARD-{cardId(uuid)}-{price}-{timestamp}
    if (!invoiceNumber.startsWith('SIGCARD-')) {
      console.error('[Signature Card Callback] Invalid invoice format:', invoiceNumber)
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Extract cardId (UUID) — UUID is 36 chars (8-4-4-4-12)
    const withoutPrefix = invoiceNumber.slice('SIGCARD-'.length)
    const cardId = withoutPrefix.slice(0, 36)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(cardId)) {
      console.error('[Signature Card Callback] Invalid card ID in invoice:', invoiceNumber)
      return NextResponse.redirect(`${baseUrl}/account/signature-card?purchase=error`)
    }

    // Server-side verification (matches checkout callback pattern)
    const isSandbox = process.env.PAYSTATION_SANDBOX_MODE === 'true'
    let verifiedStatus = status
    let verifiedTrxId = trxId || `MOCK-${Date.now()}`

    if (isSandbox) {
      console.log('[Signature Card Callback] Sandbox mode — skipping server-side verification')
    } else {
      console.log('[Signature Card Callback] Production mode — verifying transaction:', invoiceNumber)
      try {
        const verification = await paystationClient.verifyTransaction(invoiceNumber)
        console.log('[Signature Card Callback] Verification result:', JSON.stringify(verification))

        if (!verification.success || !verification.data) {
          console.error('[Signature Card Callback] Verification failed, falling back to callback status:', status)
          verifiedStatus = status
        } else {
          verifiedStatus = verification.data.trx_status
          verifiedTrxId = verification.data.trx_id
        }
      } catch (verifyError) {
        console.error('[Signature Card Callback] Verification threw error:', verifyError)
        console.log('[Signature Card Callback] Falling back to callback status:', status)
        verifiedStatus = status
      }
    }

    // Case-insensitive success check (PayStation may send "Success", "success", "Successful", etc.)
    const isSuccess = verifiedStatus?.toLowerCase().includes('success')
    console.log('[Signature Card Callback] isSuccess:', isSuccess, 'verifiedStatus:', verifiedStatus)

    if (!isSuccess) {
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
