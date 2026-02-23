import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateCardNumber, getVirtualCardTiers } from '@/lib/virtual-card'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get user
    const { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if card already exists
    const { data: existingCard } = await supabase
      .from('VirtualCard')
      .select('*')
      .eq('userId', user.id)
      .single()

    if (existingCard) {
      return NextResponse.json({ card: existingCard, tiers: await getVirtualCardTiers() })
    }

    // Generate unique card number (retry on collision)
    let cardNumber = generateCardNumber()
    let attempts = 0
    while (attempts < 5) {
      const { data: collision } = await supabase
        .from('VirtualCard')
        .select('id')
        .eq('cardNumber', cardNumber)
        .single()

      if (!collision) break
      cardNumber = generateCardNumber()
      attempts++
    }

    // Create card
    const { data: card, error } = await supabase
      .from('VirtualCard')
      .insert({
        userId: user.id,
        cardNumber,
        balance: 0,
        lifetimeLoaded: 0,
        tierLevel: 'STANDARD',
        discountPercent: 0,
      })
      .select('*')
      .single()

    if (error || !card) {
      throw new Error('Failed to create virtual card')
    }

    const tiers = await getVirtualCardTiers()

    return NextResponse.json({ card, tiers })
  } catch (error) {
    console.error('Create virtual card error:', error)
    return NextResponse.json({ error: 'Failed to create virtual card' }, { status: 500 })
  }
}
