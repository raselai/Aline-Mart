import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { addressFormSchema } from '@/types/checkout'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Look up user by email
    const { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ addresses: [] })
    }

    const { data: addresses, error } = await supabase
      .from('Address')
      .select('*')
      .eq('userId', user.id)
      .order('isDefault', { ascending: false })
      .order('createdAt', { ascending: false })

    if (error) throw error

    return NextResponse.json({ addresses: addresses || [] })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, ...addressData } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate address data
    const validation = addressFormSchema.safeParse(addressData)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid address data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const data = validation.data
    const supabase = await createServerClient()

    // Look up user
    const { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check existing address count
    const { count } = await supabase
      .from('Address')
      .select('id', { count: 'exact', head: true })
      .eq('userId', user.id)

    const isFirstAddress = (count ?? 0) === 0
    const shouldBeDefault = isFirstAddress || data.isDefault === true

    // If setting as default, unset all others
    if (shouldBeDefault) {
      await supabase
        .from('Address')
        .update({ isDefault: false })
        .eq('userId', user.id)
    }

    const { data: address, error } = await supabase
      .from('Address')
      .insert({
        id: crypto.randomUUID(),
        userId: user.id,
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        isDefault: shouldBeDefault,
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    )
  }
}
