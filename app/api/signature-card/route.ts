import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getCardTypeConfigs } from '@/lib/signature-card'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Look up user by email
    let { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    // Auto-create User row if authenticated but missing from User table
    if (!user) {
      const newId = crypto.randomUUID()
      const name = email.split('@')[0]

      const { data: newUser, error: insertError } = await supabase
        .from('User')
        .insert({ id: newId, email, name })
        .select('id')
        .single()

      if (insertError || !newUser) {
        console.error('Failed to auto-create User row:', insertError)
        const cardTypes = await getCardTypeConfigs()
        return NextResponse.json({ cards: [], cardTypes, userId: null })
      }

      user = newUser
    }

    const { data: cards } = await supabase
      .from('SignatureCard')
      .select('*')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })

    const cardTypes = await getCardTypeConfigs()

    return NextResponse.json({
      cards: cards || [],
      cardTypes,
      userId: user.id,
    })
  } catch (error) {
    console.error('Fetch signature cards error:', error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}
