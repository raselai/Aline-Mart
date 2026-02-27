import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const body = await request.json()
    const { physicalCardStatus } = body

    const validStatuses = ['PENDING', 'SHIPPED', 'DELIVERED']
    if (!physicalCardStatus || !validStatuses.includes(physicalCardStatus)) {
      return NextResponse.json(
        { error: 'Invalid physical card status' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    const { data: card, error } = await supabase
      .from('SignatureCard')
      .update({
        physicalCardStatus,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error || !card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    return NextResponse.json({ card })
  } catch (error) {
    console.error('Admin update signature card error:', error)
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 })
  }
}
