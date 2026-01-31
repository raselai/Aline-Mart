import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { createTransaction } from '@/lib/accounts'
import type { TransactionType } from '@/types/accounts'

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as TransactionType | null
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('Transaction')
      .select(`
        *,
        order:Order!Transaction_orderId_fkey(
          orderNumber,
          total
        )
      `, { count: 'exact' })
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (type) {
      query = query.eq('type', type)
    }

    if (dateFrom) {
      query = query.gte('createdAt', dateFrom)
    }

    if (dateTo) {
      query = query.lte('createdAt', dateTo + 'T23:59:59')
    }

    if (search) {
      query = query.or(`description.ilike.%${search}%,reference.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      transactions: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, description, reference } = body

    if (!type || amount === undefined) {
      return NextResponse.json(
        { error: 'Type and amount are required' },
        { status: 400 }
      )
    }

    const validTypes: TransactionType[] = ['SALE', 'REFUND', 'COD_COLLECTION', 'VENDOR_PAYOUT', 'ADJUSTMENT']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    const transaction = await createTransaction({
      type,
      amount: Number(amount),
      description,
      reference,
      createdBy: session.user.id,
    })

    return NextResponse.json({
      success: true,
      transaction,
      message: 'Transaction created successfully',
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
