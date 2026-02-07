import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { restoreStockWithLog } from '@/lib/inventory'
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
        shippingStatus,
        paymentMethod,
        paymentStatus,
        paymentChannel,
        shippingCost,
        paystationTransactionId,
        cancellationReason,
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
          subOrderNumber,
          status,
          productId,
          productName,
          brandName,
          variantId,
          variantName,
          quantity,
          price,
          total,
          costPrice,
          vendor,
          itemCancellationReason
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

    // Fetch product images for each order item
    const productIds = (order.OrderItem || []).map((item: any) => item.productId).filter(Boolean)
    let productImageMap: Record<string, string | null> = {}

    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('Product')
        .select(`
          id,
          ProductImage (
            url,
            order
          )
        `)
        .in('id', productIds)

      if (products) {
        products.forEach((product: any) => {
          const images = product.ProductImage || []
          const sortedImages = images.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          productImageMap[product.id] = sortedImages[0]?.url || null
        })
      }
    }

    // Transform to match OrderWithDetails interface
    const transformedOrder: OrderWithDetails = {
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      shippingStatus: order.shippingStatus || 'PROCESSING',
      paymentMethod: order.paymentMethod || 'COD',
      paymentStatus: order.paymentStatus || 'UNPAID',
      paymentChannel: order.paymentChannel || null,
      shippingCost: order.shippingCost || 0,
      paystationTransactionId: order.paystationTransactionId,
      cancellationReason: order.cancellationReason || null,
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
        status: item.status || 'ACTIVE',
        image: productImageMap[item.productId] || null,
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
 * Update order status and/or shipping status
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
    const { status: newStatus, shippingStatus: newShippingStatus, cancellationReason } = body

    if (!newStatus && !newShippingStatus) {
      return NextResponse.json(
        { error: 'Either status or shippingStatus is required' },
        { status: 400 }
      )
    }

    // Get current order for side effects
    const { data: currentOrder, error: fetchError } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        status,
        shippingStatus,
        userId,
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

    // Build update data
    const updateData: Record<string, string> = {
      updatedAt: new Date().toISOString(),
    }

    if (newStatus) {
      updateData.status = newStatus
    }
    if (newShippingStatus) {
      updateData.shippingStatus = newShippingStatus
    }
    if (cancellationReason) {
      updateData.cancellationReason = cancellationReason
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('Order')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    let message = newStatus
      ? `Order status updated to ${newStatus}`
      : `Shipping status updated to ${newShippingStatus}`

    // Restore stock when order status is set to CANCEL
    if (newStatus === 'CANCEL' && currentOrder.status !== 'CANCEL') {
      try {
        const orderItems = currentOrder.OrderItem?.map((item: Record<string, unknown>) => ({
          variantId: item.variantId as string,
          quantity: item.quantity as number
        })).filter((item: { variantId: string }) => item.variantId) || []

        if (orderItems.length > 0) {
          await restoreStockWithLog(orderItems, 'CANCELLED_ORDER', id)
          message += '. Stock has been restored.'
        }
      } catch (stockError) {
        console.error('Error restoring stock:', stockError)
        message += '. Warning: Failed to restore stock.'
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
