import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import type { CODCollectionStatus } from '@/types/accounts'

export async function GET(request: Request) {
  try {
    await requireModuleAccess('accounts')

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as CODCollectionStatus | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('CODCollection')
      .select(`
        *,
        order:Order!CODCollection_orderId_fkey(
          orderNumber,
          total,
          status,
          createdAt,
          user:User!Order_userId_fkey(
            name,
            email
          ),
          shippingAddress:Address!Order_shippingAddressId_fkey(
            fullName,
            city
          )
        )
      `, { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (status) {
      query = query.eq('status', status)
    }

    if (dateFrom) {
      query = query.gte('createdAt', dateFrom)
    }

    if (dateTo) {
      query = query.lte('createdAt', dateTo + 'T23:59:59')
    }

    const { data, error, count } = await query

    if (error) throw error

    // Calculate pending totals
    const { data: pendingData } = await supabase
      .from('CODCollection')
      .select('expectedAmount')
      .eq('status', 'PENDING')

    const pendingTotal = (pendingData || []).reduce(
      (sum, c) => sum + Number(c.expectedAmount), 0
    )

    return NextResponse.json({
      collections: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
      pendingTotal,
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching COD collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch COD collections' },
      { status: 500 }
    )
  }
}
