import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/lib/order-utils'
import { parseProductWeight } from '@/lib/shipping'
import { getPathaoPriceEstimate } from '@/lib/pathao'
import { validateStock, decrementStockWithLog } from '@/lib/inventory'
import { createTransaction } from '@/lib/accounts'
import { checkoutSchema } from '@/types/checkout'
import type { CartItem } from '@/types/checkout'
import {
  deductBalance,
  isOTPTokenValid,
  isCardValid,
  getCardTypeConfigs,
  getAlineFashionBrandId,
  calculateDiscounts,
  shouldApplyFreeDelivery,
} from '@/lib/signature-card'

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

    // Calculate subtotal
    const subtotal = (cartItems as CartItem[]).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Fetch product weights, cost data, and brandId for shipping + order items + discount calc
    const productIds = (cartItems as CartItem[]).map((item) => item.productId)
    const productDataMap: Record<string, { costPrice: number | null; vendor: string | null; weight: number; brandId: number | null }> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('Product')
        .select('id, costPrice, vendor, weight, brandId')
        .in('id', productIds)

      if (products) {
        for (const product of products) {
          productDataMap[product.id] = {
            costPrice: product.costPrice ?? null,
            vendor: product.vendor ?? null,
            weight: parseProductWeight(product.weight),
            brandId: product.brandId ?? null,
          }
        }
      }
    }

    // Calculate shipping via Pathao price estimate
    let totalWeightKg = 0
    for (const item of cartItems as CartItem[]) {
      totalWeightKg += (productDataMap[item.productId]?.weight ?? 0) * item.quantity
    }

    const itemWeight = Math.max(totalWeightKg, 0.5)

    const storeId = parseInt(process.env.PATHAO_STORE_ID || '0', 10)
    if (!storeId) {
      return NextResponse.json({ error: 'Shipping provider is not configured' }, { status: 500 })
    }

    if (!data.pathaoCityId || !data.pathaoZoneId) {
      return NextResponse.json({ error: 'Shipping address with Pathao location is required' }, { status: 400 })
    }

    const pathaoEstimate = await getPathaoPriceEstimate({
      store_id: storeId,
      item_type: 2,
      delivery_type: 48,
      item_weight: itemWeight,
      recipient_city: data.pathaoCityId,
      recipient_zone: data.pathaoZoneId,
    })

    let shippingCost = pathaoEstimate.price

    // Signature Card: validate card, OTP, calculate discounts
    let signatureCardDiscount = 0
    let signatureCardId: string | null = null
    let discountBreakdownDescription = ''

    if (data.paymentMethod === 'SIGNATURE_CARD') {
      const { signatureCardNumber, discountOtpId } = data

      if (!signatureCardNumber) {
        return NextResponse.json({ error: 'Signature card number is required' }, { status: 400 })
      }

      if (!discountOtpId) {
        return NextResponse.json({ error: 'OTP verification is required' }, { status: 400 })
      }

      // Look up card
      const { data: sigCard } = await supabase
        .from('SignatureCard')
        .select('*')
        .eq('cardNumber', signatureCardNumber)
        .single()

      if (!sigCard) {
        return NextResponse.json({ error: 'Signature card not found' }, { status: 400 })
      }

      // Check card validity
      if (!isCardValid(sigCard)) {
        return NextResponse.json({ error: 'Signature card is expired or inactive' }, { status: 400 })
      }

      // Validate OTP token
      const otpValid = await isOTPTokenValid(discountOtpId, sigCard.id)
      if (!otpValid) {
        return NextResponse.json({ error: 'OTP verification has expired or was already used. Please verify again.' }, { status: 400 })
      }

      signatureCardId = sigCard.id

      // Get Aline Fashion brand ID and card type configs for discount calculation
      const alineFashionBrandId = await getAlineFashionBrandId()
      const cardTypes = await getCardTypeConfigs()

      // Build cart items with brandId for discount calculation
      const itemsForDiscount = (cartItems as CartItem[]).map((item) => ({
        price: item.price,
        quantity: item.quantity,
        brandId: productDataMap[item.productId]?.brandId ?? null,
      }))

      // Server-side discount calculation using card category
      const discounts = calculateDiscounts(
        itemsForDiscount,
        alineFashionBrandId,
        sigCard.category,
        sigCard.dateOfBirth,
        sigCard.weddingAnniversary,
        cardTypes
      )

      signatureCardDiscount = discounts.totalDiscount

      // Build description for logging
      const parts: string[] = []
      if (discounts.alineFashionDiscount > 0) parts.push(`Aline Fashion: -৳${discounts.alineFashionDiscount}`)
      if (discounts.otherBrandsDiscount > 0) parts.push(`Other brands: -৳${discounts.otherBrandsDiscount}`)
      if (discounts.birthdayBonus > 0) parts.push(`Birthday/Anniversary bonus: -৳${discounts.birthdayBonus}`)
      discountBreakdownDescription = parts.join(', ')

      // Crown gets free delivery
      if (shouldApplyFreeDelivery(sigCard.category)) {
        shippingCost = 0
      }

      // Check sufficient balance (subtotal - discount + shipping)
      const requiredAmount = subtotal - signatureCardDiscount + shippingCost
      if (Number(sigCard.balance) < requiredAmount) {
        return NextResponse.json({
          error: `Insufficient card balance. Required: ৳${requiredAmount.toFixed(2)}, Available: ৳${Number(sigCard.balance).toFixed(2)}`,
        }, { status: 400 })
      }
    }

    const total = subtotal - signatureCardDiscount + shippingCost

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
          pathaoCityId: data.pathaoCityId ?? null,
          pathaoZoneId: data.pathaoZoneId ?? null,
          pathaoAreaId: data.pathaoAreaId ?? null,
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
        shippingStatus: 'PROCESSING',
        paymentStatus: 'UNPAID',
        shippingAddressId: addressId,
        paymentMethod: data.paymentMethod,
        shippingCost,
      })
      .select('*')
      .single()

    if (orderError || !order) {
      throw new Error('Failed to create order')
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

    // Decrement stock for COD and SIGNATURE_CARD orders immediately
    // PayStation orders decrement stock in the callback after payment confirmation
    // Skip products without real variants (variantId ending in '-default')
    if (data.paymentMethod === 'COD' || data.paymentMethod === 'SIGNATURE_CARD') {
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
        console.error('Failed to decrement stock:', stockError)
        // Don't fail the order - log for manual review
      }

      // Create COD collection record (COD only)
      if (data.paymentMethod === 'COD') {
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

      // Signature Card: deduct balance and mark order as PAID
      if (data.paymentMethod === 'SIGNATURE_CARD' && signatureCardId) {
        try {
          await deductBalance(
            signatureCardId,
            total,
            order.id,
            `Order ${orderNumber}${discountBreakdownDescription ? ` (${discountBreakdownDescription})` : ''}`
          )

          // Log discount as a separate transaction if any
          if (signatureCardDiscount > 0) {
            await supabase.from('CardTransaction').insert({
              cardId: signatureCardId,
              type: 'DISCOUNT_USED',
              amount: signatureCardDiscount,
              balanceAfter: 0, // Will be overwritten by actual balance but serves as log
              orderId: order.id,
              description: `Discount on Order ${orderNumber}: ${discountBreakdownDescription}`,
            })
          }

          // Mark OTP as consumed
          if (data.discountOtpId) {
            await supabase
              .from('CardOTP')
              .update({ usedForOrderId: order.id })
              .eq('id', data.discountOtpId)
          }

          await supabase.from('Order').update({
            status: 'CONFIRM',
            paymentStatus: 'PAID',
            updatedAt: new Date().toISOString(),
          }).eq('id', order.id)
        } catch (scError) {
          console.error('Failed to process signature card payment:', scError)
          // Rollback: delete order if payment fails
          await supabase.from('OrderItem').delete().eq('orderId', order.id)
          await supabase.from('Order').delete().eq('id', order.id)
          return NextResponse.json(
            { error: 'Failed to process Signature Card payment. Your balance was not charged.' },
            { status: 500 }
          )
        }
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
