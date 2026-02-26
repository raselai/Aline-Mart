import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { addressFormSchema } from '@/types/checkout'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }


    // Look up user by email
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (userError) {
      console.error('Error looking up user:', userError)
      return NextResponse.json({ addresses: [] })
    }

    if (!user) {
      return NextResponse.json({ addresses: [] })
    }

    const { data: addresses, error } = await supabase
      .from('Address')
      .select('*')
      .eq('userId', user.id)
      .order('isDefault', { ascending: false })

    if (error) {
      console.error('Error fetching addresses:', error)
      return NextResponse.json({ addresses: [] })
    }

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

    // Look up user, or create if they exist in auth but not in User table
    let { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (!user) {
      // Auto-create User row for authenticated users
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          id: crypto.randomUUID(),
          email,
        })
        .select('id')
        .single()

      if (createError || !newUser) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
      user = newUser
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
        pathaoCityId: data.pathaoCityId ?? null,
        pathaoZoneId: data.pathaoZoneId ?? null,
        pathaoAreaId: data.pathaoAreaId ?? null,
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error creating address:', message, error)
    return NextResponse.json(
      { error: message || 'Failed to create address' },
      { status: 500 }
    )
  }
}
