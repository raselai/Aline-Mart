import { NextRequest, NextResponse } from 'next/server'
import { validateStock } from '@/lib/inventory'
import type { CartItem } from '@/types/checkout'

export async function POST(request: NextRequest) {
  try {
    const { cartItems } = await request.json()

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    const validation = await validateStock(cartItems as CartItem[])

    if (validation.valid) {
      return NextResponse.json({ valid: true })
    }

    return NextResponse.json({
      valid: false,
      errors: validation.errors,
    })
  } catch (error) {
    console.error('Stock validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate stock' },
      { status: 500 }
    )
  }
}
