import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addressFormSchema } from '@/types/checkout'

async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data: user } = await supabase
    .from('User')
    .select('id')
    .eq('email', email)
    .maybeSingle()
  return user?.id ?? null
}

async function verifyOwnership(addressId: string, userId: string): Promise<boolean> {
  const { data: address } = await supabase
    .from('Address')
    .select('userId')
    .eq('id', addressId)
    .single()
  return address?.userId === userId
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const { id } = params
    const body = await request.json()
    const { email, ...addressData } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const validation = addressFormSchema.safeParse(addressData)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid address data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const data = validation.data
    const userId = await getUserIdByEmail(email)
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isOwner = await verifyOwnership(id, userId)
    if (!isOwner) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If setting as default, unset all others
    if (data.isDefault) {
      await supabase
        .from('Address')
        .update({ isDefault: false })
        .eq('userId', userId)
    }

    const { data: address, error } = await supabase
      .from('Address')
      .update({
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        isDefault: data.isDefault ?? false,
        pathaoCityId: data.pathaoCityId ?? null,
        pathaoZoneId: data.pathaoZoneId ?? null,
        pathaoAreaId: data.pathaoAreaId ?? null,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const { id } = params
    const email = request.nextUrl.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const userId = await getUserIdByEmail(email)
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isOwner = await verifyOwnership(id, userId)
    if (!isOwner) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Check if this was the default address
    const { data: deletedAddress } = await supabase
      .from('Address')
      .select('isDefault')
      .eq('id', id)
      .single()

    const wasDefault = deletedAddress?.isDefault

    // Delete the address
    const { error } = await supabase
      .from('Address')
      .delete()
      .eq('id', id)

    if (error) throw error

    // If deleted address was default, promote the most recent remaining
    if (wasDefault) {
      const { data: remaining } = await supabase
        .from('Address')
        .select('id')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .limit(1)

      if (remaining && remaining.length > 0) {
        await supabase
          .from('Address')
          .update({ isDefault: true })
          .eq('id', remaining[0].id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const { id } = params
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const userId = await getUserIdByEmail(email)
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isOwner = await verifyOwnership(id, userId)
    if (!isOwner) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Unset all defaults for this user
    await supabase
      .from('Address')
      .update({ isDefault: false })
      .eq('userId', userId)

    // Set this one as default
    const { data: address, error } = await supabase
      .from('Address')
      .update({ isDefault: true })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    )
  }
}
