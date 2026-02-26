import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import { processRefund } from '@/lib/accounts'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, props: RouteParams) {
  try {
    await requireModuleAccess('accounts')

    const params = await props.params
    const { id } = params

    const { data, error } = await supabase
      .from('Refund')
      .select(`
        *,
        order:Order!Refund_orderId_fkey(
          orderNumber,
          total,
          paymentMethod,
          status,
          items:OrderItem(
            id,
            productName,
            brandName,
            variantName,
            quantity,
            price,
            total
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Refund not found' }, { status: 404 })
    }

    return NextResponse.json({ refund: data })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching refund:', error)
    return NextResponse.json({ error: 'Failed to fetch refund' }, { status: 500 })
  }
}

export async function PATCH(request: Request, props: RouteParams) {
  try {
    const admin = await requireModuleAccess('accounts')

    const params = await props.params
    const { id } = params
    const body = await request.json()
    const { action } = body

    if (!action || !['PROCESSED', 'REJECTED'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid action (PROCESSED or REJECTED) is required' },
        { status: 400 }
      )
    }

    await processRefund(id, admin.id, action)

    return NextResponse.json({
      success: true,
      message: `Refund ${action.toLowerCase()} successfully`,
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error processing refund:', error)
    return NextResponse.json({ error: 'Failed to process refund' }, { status: 500 })
  }
}
