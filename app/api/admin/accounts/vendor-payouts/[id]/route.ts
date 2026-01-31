import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { markPayoutPaid } from '@/lib/accounts'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, props: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    const { id } = params

    const { data, error } = await supabase
      .from('VendorPayout')
      .select(`
        *,
        vendor:Vendor!VendorPayout_vendorId_fkey(
          shopName,
          ownerName,
          email,
          bankName,
          bankBranch,
          accountHolderName,
          accountNumber,
          routingNumber,
          mobileBanking
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 })
    }

    return NextResponse.json({ payout: data })
  } catch (error) {
    console.error('Error fetching payout:', error)
    return NextResponse.json({ error: 'Failed to fetch payout' }, { status: 500 })
  }
}

export async function PATCH(request: Request, props: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await props.params
    const { id } = params
    const body = await request.json()
    const { reference } = body

    await markPayoutPaid(id, session.user.id, reference)

    return NextResponse.json({
      success: true,
      message: 'Payout marked as paid',
    })
  } catch (error) {
    console.error('Error marking payout paid:', error)
    return NextResponse.json({ error: 'Failed to mark payout as paid' }, { status: 500 })
  }
}
