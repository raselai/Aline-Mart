import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getVirtualCardTiers } from '@/lib/virtual-card'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get user by email
    const { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ card: null, tiers: await getVirtualCardTiers() })
    }

    // Get virtual card
    const { data: card } = await supabase
      .from('VirtualCard')
      .select('*')
      .eq('userId', user.id)
      .single()

    const tiers = await getVirtualCardTiers()

    return NextResponse.json({ card: card || null, tiers })
  } catch (error) {
    console.error('Get virtual card error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch virtual card', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
