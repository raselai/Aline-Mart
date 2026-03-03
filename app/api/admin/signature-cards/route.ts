import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const category = searchParams.get('category')
    const physicalCardStatus = searchParams.get('physicalCardStatus')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit
    const supabase = await createServerClient()

    let query = supabase
      .from('SignatureCard')
      .select('*', { count: 'exact' })
      .eq('isActive', true)

    if (category) {
      query = query.eq('category', category)
    }

    if (physicalCardStatus) {
      query = query.eq('physicalCardStatus', physicalCardStatus)
    }

    if (search) {
      query = query.or(`cardholderName.ilike.%${search}%,cardNumber.ilike.%${search}%`)
    }

    const { data: cards, count } = await query
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    return NextResponse.json({
      cards: cards || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error('Admin fetch signature cards error:', error)
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 })
  }
}
