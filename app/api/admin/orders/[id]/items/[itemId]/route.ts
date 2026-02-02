import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { restoreStockWithLog } from '@/lib/inventory'

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>
}

/**
 * PATCH /api/admin/orders/[id]/items/[itemId]
 * Cancel a specific order item
 * Restores stock and recalculates order total
 */
export async function PATCH(request: Request, props: RouteParams) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id: orderId, itemId } = params
    const body = await request.json()
    const { status: newStatus, reason } = body

    if (!newStatus) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    if (newStatus === 'CANCELLED' && !reason) {
      return NextResponse.json(
        { error: 'Cancellation reason is required' },
        { status: 400 }
      )
    }

    // Fetch the order item
    const { data: item, error: itemError } = await supabase
      .from('OrderItem')
      .select('*')
      .eq('id', itemId)
      .eq('orderId', orderId)
      .single()

    if (itemError || !item) {
      return NextResponse.json(
        { error: 'Order item not found' },
        { status: 404 }
      )
    }

    if (item.status === newStatus) {
      return NextResponse.json(
        { error: `Item is already ${newStatus}` },
        { status: 400 }
      )
    }

    if (item.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: `Cannot change status of ${item.status} item` },
        { status: 400 }
      )
    }

    // Update the order item status
    const updateData: Record<string, string> = {
      status: newStatus,
    }

    if (newStatus === 'CANCELLED' && reason) {
      updateData.itemCancellationReason = reason
    }

    const { error: updateError } = await supabase
      .from('OrderItem')
      .update(updateData)
      .eq('id', itemId)

    if (updateError) {
      throw updateError
    }

    let message = `Item ${item.subOrderNumber || itemId} marked as ${newStatus}`

    // Restore stock for cancelled items
    if (newStatus === 'CANCELLED' && item.variantId && !item.variantId.endsWith('-default')) {
      try {
        await restoreStockWithLog(
          [{ variantId: item.variantId, quantity: item.quantity }],
          'CANCELLED_ORDER',
          orderId
        )
        message += '. Stock restored.'
      } catch (stockError) {
        console.error('Error restoring stock for cancelled item:', stockError)
        message += '. Warning: Failed to restore stock.'
      }
    }

    // Recalculate order total based on active items
    const { data: allItems, error: allItemsError } = await supabase
      .from('OrderItem')
      .select('total, status')
      .eq('orderId', orderId)

    if (!allItemsError && allItems) {
      const activeTotal = allItems
        .filter((i: { status: string }) => i.status === 'ACTIVE')
        .reduce((sum: number, i: { total: number }) => sum + i.total, 0)

      // Get current order to read shipping cost
      const { data: currentOrder } = await supabase
        .from('Order')
        .select('shippingCost')
        .eq('id', orderId)
        .single()

      const shippingCost = currentOrder?.shippingCost || 0
      const newTotal = activeTotal + shippingCost

      await supabase
        .from('Order')
        .update({
          total: newTotal,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', orderId)

      message += ` Order total updated to ৳${newTotal.toLocaleString()}.`
    }

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error('Error updating order item:', error)
    return NextResponse.json(
      { error: 'Failed to update order item' },
      { status: 500 }
    )
  }
}
