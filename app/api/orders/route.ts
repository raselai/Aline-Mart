import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Find user by email
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ orders: [] })
    }

    // Get orders for this user
    const { data: orders, error: ordersError } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        total,
        status,
        paymentMethod,
        createdAt,
        updatedAt
      `)
      .eq('userId', user.id)
      .order('createdAt', { ascending: false })

    if (ordersError) {
      throw new Error('Failed to fetch orders')
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (error) {
    console.error('Fetch orders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
