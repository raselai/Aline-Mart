import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20')

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
      return NextResponse.json({ transactions: [], total: 0 })
    }

    // Get card
    const { data: card } = await supabase
      .from('VirtualCard')
      .select('id')
      .eq('userId', user.id)
      .single()

    if (!card) {
      return NextResponse.json({ transactions: [], total: 0 })
    }

    // Get total count
    const { count } = await supabase
      .from('VirtualCardTransaction')
      .select('id', { count: 'exact', head: true })
      .eq('cardId', card.id)

    // Get paginated transactions
    const offset = (page - 1) * limit
    const { data: transactions, error } = await supabase
      .from('VirtualCardTransaction')
      .select('*')
      .eq('cardId', card.id)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      transactions: transactions || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
