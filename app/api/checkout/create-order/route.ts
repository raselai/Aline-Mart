import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateOrderNumber, calculateOrderTotal } from '@/lib/order-utils'
import { validateStock, decrementStockWithLog } from '@/lib/inventory'
import { checkoutSchema } from '@/types/checkout'
import type { CartItem } from '@/types/checkout'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItems, ...formData } = body

    // Validate form data
    const validation = checkoutSchema.safeParse(formData)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const data = validation.data

    // Validate cart items exist
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Validate stock availability
    const stockValidation = await validateStock(cartItems as CartItem[])
    if (!stockValidation.valid) {
      return NextResponse.json(
        {
          error: 'Some items are out of stock',
          stockErrors: stockValidation.errors,
        },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Calculate totals
    const subtotal = (cartItems as CartItem[]).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const shippingCost = data.paymentMethod === 'COD' ? 50 : 0
    const total = subtotal + shippingCost

    // Create or get guest user
    let userId: string

    const { data: existingUser } = await supabase
      .from('User')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create guest user
      const { data: newUser, error: userError } = await supabase
        .from('User')
        .insert({
          id: crypto.randomUUID(),
          email: data.email,
          name: data.fullName,
          isGuest: true,
        })
        .select('id')
        .single()

      if (userError || !newUser) {
        throw new Error('Failed to create user')
      }

      userId = newUser.id
    }

    // Create shipping address
    const { data: address, error: addressError } = await supabase
      .from('Address')
      .insert({
        id: crypto.randomUUID(),
        userId,
        fullName: data.fullName,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
      })
      .select('id')
      .single()

    if (addressError || !address) {
      throw new Error('Failed to create address')
    }

    // Create order with PENDING status
    const orderNumber = generateOrderNumber()

    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        id: crypto.randomUUID(),
        orderNumber,
        userId,
        total,
        status: 'PENDING',
        shippingAddressId: address.id,
        paymentMethod: data.paymentMethod,
        shippingCost,
      })
      .select('*')
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create order')
    }

    // Create order items
    const orderItems = (cartItems as CartItem[]).map((item) => ({
      id: crypto.randomUUID(),
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      brandName: item.brandName,
      variantId: item.variantId,
      variantName: item.variantName,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('OrderItem')
      .insert(orderItems)

    if (itemsError) {
      // Rollback: Delete order if items fail
      await supabase.from('Order').delete().eq('id', order.id)
      throw new Error('Failed to create order items')
    }

    // Decrement stock for COD orders immediately
    // PayStation orders decrement stock in the callback after payment confirmation
    if (data.paymentMethod === 'COD') {
      try {
        await decrementStockWithLog(
          (cartItems as CartItem[]).map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          })),
          'SALE',
          order.id
        )
      } catch (stockError) {
        console.error('Failed to decrement stock for COD order:', stockError)
        // Don't fail the order - log for manual review
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
