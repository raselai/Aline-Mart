import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { canTransitionStatus } from '@/lib/order-utils'
import { restoreStockWithLog } from '@/lib/inventory'
import { sendOrderShippedEmail } from '@/lib/email'
import type { OrderWithDetails } from '@/types/order'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/orders/[id]
 * Get full order details
 * Requires admin authentication
 */
export async function GET(request: Request, props: RouteParams) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params

    // Fetch order with all related data
    const { data: order, error } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        total,
        status,
        paymentMethod,
        shippingCost,
        paystationTransactionId,
        createdAt,
        updatedAt,
        userId,
        shippingAddressId,
        User:userId (
          id,
          name,
          email
        ),
        Address:shippingAddressId (
          id,
          fullName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          zipCode,
          country
        ),
        OrderItem (
          id,
          productId,
          productName,
          brandName,
          variantId,
          variantName,
          quantity,
          price,
          total
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      console.error('Supabase error:', error)
      throw error
    }

    // Fetch product details (image and vendor) for each order item
    const productIds = (order.OrderItem || []).map((item: any) => item.productId).filter(Boolean)
    let productDetailsMap: Record<string, { image: string | null; vendor: string | null }> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('Product')
        .select(`
          id,
          vendor,
          ProductImage (
            url,
            order
          )
        `)
        .in('id', productIds)

      if (products) {
        products.forEach((product: any) => {
          // Get the first image (sorted by order)
          const images = product.ProductImage || []
          const sortedImages = images.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          const firstImage = sortedImages[0]?.url || null

          productDetailsMap[product.id] = {
            image: firstImage,
            vendor: product.vendor || null
          }
        })
      }
    }

    // Transform to match OrderWithDetails interface
    const transformedOrder: OrderWithDetails = {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      paymentMethod: order.paymentMethod || 'COD',
      shippingCost: order.shippingCost || 0,
      paystationTransactionId: order.paystationTransactionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      userId: order.userId,
      shippingAddressId: order.shippingAddressId,
      user: {
        name: (order.User as any)?.name || 'Unknown',
        email: (order.User as any)?.email || 'Unknown'
      },
      shippingAddress: {
        id: (order.Address as any)?.id || '',
        userId: order.userId,
        fullName: (order.Address as any)?.fullName || '',
        phone: (order.Address as any)?.phone || '',
        addressLine1: (order.Address as any)?.addressLine1 || '',
        addressLine2: (order.Address as any)?.addressLine2 || null,
        city: (order.Address as any)?.city || '',
        state: (order.Address as any)?.state || '',
        zipCode: (order.Address as any)?.zipCode || '',
        country: (order.Address as any)?.country || '',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      },
      items: (order.OrderItem || []).map((item: any) => ({
        ...item,
        orderId: order.id,
        image: productDetailsMap[item.productId]?.image || null,
        vendor: productDetailsMap[item.productId]?.vendor || null
      }))
    }

    return NextResponse.json({ order: transformedOrder })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Update order status
 * Requires admin authentication
 */
export async function PATCH(request: Request, props: RouteParams) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params
    const body = await request.json()
    const { status: newStatus, trackingNumber } = body

    if (!newStatus) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Get current order
    const { data: currentOrder, error: fetchError } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        status,
        userId,
        User:userId (
          email,
          name
        ),
        OrderItem (
          variantId,
          quantity
        )
      `)
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        )
      }
      throw fetchError
    }

    // Validate status transition
    if (!canTransitionStatus(currentOrder.status, newStatus)) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${currentOrder.status} to ${newStatus}`,
          currentStatus: currentOrder.status,
          validTransitions: getValidTransitionsMessage(currentOrder.status)
        },
        { status: 400 }
      )
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabase
      .from('Order')
      .update({
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    let message = `Order status updated to ${newStatus}`

    // Handle side effects based on new status
    if (newStatus === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
      // Restore stock for cancelled orders with audit log
      try {
        const orderItems = currentOrder.OrderItem?.map((item: any) => ({
          variantId: item.variantId,
          quantity: item.quantity
        })).filter((item: any) => item.variantId) || []

        if (orderItems.length > 0) {
          await restoreStockWithLog(orderItems, 'CANCELLED_ORDER', id)
          message += '. Stock has been restored.'
        }
      } catch (stockError) {
        console.error('Error restoring stock:', stockError)
        message += '. Warning: Failed to restore stock.'
      }
    }

    if (newStatus === 'SHIPPED') {
      // Send shipped email
      try {
        const userEmail = (currentOrder.User as any)?.email
        if (userEmail) {
          // Fetch full order details for email
          const { data: fullOrder } = await supabase
            .from('Order')
            .select(`
              *,
              User:userId (name, email),
              Address:shippingAddressId (*),
              OrderItem (*)
            `)
            .eq('id', id)
            .single()

          if (fullOrder) {
            const orderForEmail: OrderWithDetails = {
              ...fullOrder,
              user: {
                name: (fullOrder.User as any)?.name || 'Customer',
                email: (fullOrder.User as any)?.email
              },
              shippingAddress: fullOrder.Address as any,
              items: fullOrder.OrderItem || []
            }

            await sendOrderShippedEmail(orderForEmail, userEmail, trackingNumber)
            message += '. Shipping notification email sent.'
          }
        }
      } catch (emailError) {
        console.error('Error sending shipped email:', emailError)
        message += '. Warning: Failed to send shipping email.'
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

function getValidTransitionsMessage(currentStatus: string): string {
  const transitions: Record<string, string[]> = {
    PENDING: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: ['PENDING']
  }
  const valid = transitions[currentStatus] || []
  if (valid.length === 0) {
    return 'No transitions available (final state)'
  }
  return `Valid transitions: ${valid.join(', ')}`
}
