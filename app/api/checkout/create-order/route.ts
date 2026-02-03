import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateOrderNumber, calculateOrderTotal } from '@/lib/order-utils'
import { validateStock, decrementStockWithLog } from '@/lib/inventory'
import { createTransaction } from '@/lib/accounts'
import { checkoutSchema } from '@/types/checkout'
import type { CartItem } from '@/types/checkout'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItems, saveAddress, selectedAddressId, ...formData } = body

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

    // Resolve shipping address
    let addressId: string

    if (selectedAddressId) {
      // Reuse existing saved address — verify ownership
      const { data: existingAddress } = await supabase
        .from('Address')
        .select('id, userId')
        .eq('id', selectedAddressId)
        .single()

      if (!existingAddress || existingAddress.userId !== userId) {
        return NextResponse.json(
          { error: 'Selected address not found or does not belong to this user' },
          { status: 400 }
        )
      }

      addressId = existingAddress.id
    } else {
      // Create new shipping address
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
          isDefault: saveAddress ? true : undefined,
        })
        .select('id')
        .single()

      if (addressError || !address) {
        throw new Error('Failed to create address')
      }

      // If saving as default, unset other defaults
      if (saveAddress) {
        await supabase
          .from('Address')
          .update({ isDefault: false })
          .eq('userId', userId)
          .neq('id', address.id)
      }

      addressId = address.id
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
        shippingAddressId: addressId,
        paymentMethod: data.paymentMethod,
        shippingCost,
      })
      .select('*')
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create order')
    }

    // Fetch cost prices and vendor from Product table to capture at order time
    const productIds = (cartItems as CartItem[]).map((item) => item.productId)
    const productDataMap: Record<string, { costPrice: number | null; vendor: string | null }> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('Product')
        .select('id, costPrice, vendor')
        .in('id', productIds)

      if (products) {
        for (const product of products) {
          productDataMap[product.id] = {
            costPrice: product.costPrice ?? null,
            vendor: product.vendor ?? null,
          }
        }
      }
    }

    // Create order items with sub-order numbers
    const orderItems = (cartItems as CartItem[]).map((item, index) => ({
      id: crypto.randomUUID(),
      orderId: order.id,
      subOrderNumber: `${orderNumber}-${index + 1}`,
      status: 'ACTIVE',
      productId: item.productId,
      productName: item.productName,
      brandName: item.brandName,
      variantId: item.variantId,
      variantName: item.variantName,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      costPrice: productDataMap[item.productId]?.costPrice ?? null,
      vendor: productDataMap[item.productId]?.vendor ?? null,
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
    // Skip products without real variants (variantId ending in '-default')
    if (data.paymentMethod === 'COD') {
      const itemsWithVariants = (cartItems as CartItem[])
        .filter(item => !item.variantId.endsWith('-default'))
        .map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))

      try {
        if (itemsWithVariants.length > 0) {
          await decrementStockWithLog(
            itemsWithVariants,
            'SALE',
            order.id
          )
        }
      } catch (stockError) {
        console.error('Failed to decrement stock for COD order:', stockError)
        // Don't fail the order - log for manual review
      }

      // Create COD collection record
      try {
        await supabase.from('CODCollection').insert({
          id: crypto.randomUUID(),
          orderId: order.id,
          expectedAmount: total,
          status: 'PENDING',
        })
        await supabase.from('Order').update({ codCollectionStatus: 'PENDING' }).eq('id', order.id)
      } catch (codError) {
        console.error('Failed to create COD collection record:', codError)
      }
    }

    // Create SALE transaction for the order
    try {
      await createTransaction({
        type: 'SALE',
        amount: total,
        orderId: order.id,
        description: `Order ${orderNumber} - ${data.paymentMethod}`,
      })
    } catch (txError) {
      console.error('Failed to create sale transaction:', txError)
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
