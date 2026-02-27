import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateOTP, isCardValid } from '@/lib/signature-card'
import { sendSignatureCardOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { cardNumber } = await request.json()

    if (!cardNumber) {
      return NextResponse.json({ error: 'Card number is required' }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: card } = await supabase
      .from('SignatureCard')
      .select('*')
      .eq('cardNumber', cardNumber)
      .single()

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    if (!isCardValid(card)) {
      return NextResponse.json({ error: 'Card is expired or inactive' }, { status: 400 })
    }

    const otpCode = await generateOTP(card.id)

    // Send OTP via email
    const emailResult = await sendSignatureCardOTPEmail(
      otpCode,
      card.email,
      card.cardholderName
    )

    if (!emailResult.success) {
      console.error('Failed to send OTP email:', emailResult.error)
      // Still return success — OTP was generated, email delivery is best-effort
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to registered email',
      // Mask the email for display
      maskedEmail: card.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP'
    console.error('Send OTP error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
