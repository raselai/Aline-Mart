import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cardId = searchParams.get('cardId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    if (!cardId) {
      return NextResponse.json({ error: 'cardId is required' }, { status: 400 })
    }

    const offset = (page - 1) * limit
    const supabase = await createServerClient()

    const { data: transactions, count } = await supabase
      .from('CardTransaction')
      .select('*', { count: 'exact' })
      .eq('cardId', cardId)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    return NextResponse.json({
      transactions: transactions || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Fetch card transactions error:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}
