import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyOTP } from '@/lib/signature-card'

export async function POST(request: NextRequest) {
  try {
    const { cardNumber, otpCode } = await request.json()

    if (!cardNumber || !otpCode) {
      return NextResponse.json({ error: 'Card number and OTP code are required' }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: card } = await supabase
      .from('SignatureCard')
      .select('id')
      .eq('cardNumber', cardNumber)
      .single()

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    const otpId = await verifyOTP(card.id, otpCode)

    return NextResponse.json({
      success: true,
      otpId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to verify OTP'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
