import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { markCODCollected } from '@/lib/accounts'

interface RouteParams {
  params: Promise<{ orderId: string }>
}

export async function GET(request: Request, props: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    const { orderId } = params

    const { data, error } = await supabase
      .from('CODCollection')
      .select(`
        *,
        order:Order!CODCollection_orderId_fkey(
          orderNumber,
          total,
          status,
          createdAt,
          user:User!Order_userId_fkey(name, email),
          shippingAddress:Address!Order_shippingAddressId_fkey(fullName, city, phone)
        )
      `)
      .eq('orderId', orderId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'COD collection not found' }, { status: 404 })
    }

    return NextResponse.json({ collection: data })
  } catch (error) {
    console.error('Error fetching COD collection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch COD collection' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, props: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    const { orderId } = params
    const body = await request.json()
    const { collectedAmount, notes } = body

    if (collectedAmount === undefined || collectedAmount < 0) {
      return NextResponse.json(
        { error: 'Valid collected amount is required' },
        { status: 400 }
      )
    }

    await markCODCollected({
      orderId,
      collectedAmount: Number(collectedAmount),
      notes,
      collectedBy: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: 'COD collection recorded successfully',
    })
  } catch (error) {
    console.error('Error marking COD collected:', error)
    return NextResponse.json(
      { error: 'Failed to record COD collection' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, props: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    const { orderId } = params
    const body = await request.json()

    const { error } = await supabase
      .from('CODCollection')
      .update({
        notes: body.notes,
        ...(body.collectedAmount !== undefined && { collectedAmount: body.collectedAmount }),
      })
      .eq('orderId', orderId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'COD collection updated',
    })
  } catch (error) {
    console.error('Error updating COD collection:', error)
    return NextResponse.json(
      { error: 'Failed to update COD collection' },
      { status: 500 }
    )
  }
}
