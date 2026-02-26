import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import { createPathaoOrder, getPathaoOrderInfo, mapPathaoStatusToShippingStatus } from '@/lib/pathao'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * POST /api/admin/orders/[id]/pathao
 * Book a shipment with Pathao Courier
 */
export async function POST(_request: Request, props: RouteParams) {
  try {
    await requireModuleAccess('orders')
    const { id } = await props.params

    // Fetch order with address
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        total,
        status,
        shippingStatus,
        paymentMethod,
        pathaoConsignmentId,
        shippingAddressId,
        Address:shippingAddressId (
          fullName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          zipCode,
          pathaoCityId,
          pathaoZoneId,
          pathaoAreaId
        ),
        OrderItem (
          productId,
          quantity
        )
      `)
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.pathaoConsignmentId) {
      return NextResponse.json(
        { error: 'Order already has a Pathao shipment booked', consignmentId: order.pathaoConsignmentId },
        { status: 400 }
      )
    }

    // Supabase returns the join as an object (single relation) or array
    const rawAddress = order.Address
    const address = (Array.isArray(rawAddress) ? rawAddress[0] : rawAddress) as Record<string, unknown> | null
    if (!address) {
      return NextResponse.json({ error: 'Order has no shipping address' }, { status: 400 })
    }

    const recipientCity = address.pathaoCityId as number | null
    const recipientZone = address.pathaoZoneId as number | null

    if (!recipientCity || !recipientZone) {
      return NextResponse.json(
        { error: 'Shipping address is missing Pathao city/zone IDs. The customer needs to update their address with location data.' },
        { status: 400 }
      )
    }

    // Calculate total weight from products
    const productIds = ((order.OrderItem as Record<string, unknown>[]) || [])
      .map((item) => item.productId as string)
      .filter(Boolean)

    let totalWeightKg = 0.5 // default minimum
    if (productIds.length > 0) {
      const { data: products } = await supabase
        .from('Product')
        .select('id, weight')
        .in('id', productIds)

      if (products) {
        const weightMap: Record<string, number> = {}
        for (const p of products) {
          const w = typeof p.weight === 'string' ? parseFloat(p.weight) : (p.weight ?? 0)
          weightMap[p.id] = isNaN(w) ? 0 : w
        }
        totalWeightKg = ((order.OrderItem as Record<string, unknown>[]) || []).reduce(
          (sum, item) => sum + (weightMap[item.productId as string] || 0) * (item.quantity as number),
          0
        )
      }
    }

    // Clamp weight between 0.5 and 10kg
    totalWeightKg = Math.max(0.5, Math.min(10, totalWeightKg))

    const totalItemCount = ((order.OrderItem as Record<string, unknown>[]) || []).reduce(
      (sum, item) => sum + (item.quantity as number),
      0
    )

    const storeId = parseInt(process.env.PATHAO_STORE_ID || '0', 10)
    if (!storeId) {
      return NextResponse.json({ error: 'PATHAO_STORE_ID is not configured' }, { status: 500 })
    }

    // Build recipient address string
    const addressParts = [address.addressLine1 as string]
    if (address.addressLine2) addressParts.push(address.addressLine2 as string)
    addressParts.push(`${address.city as string}, ${address.state as string} ${address.zipCode as string}`)

    const isCOD = order.paymentMethod === 'COD'

    const result = await createPathaoOrder({
      store_id: storeId,
      merchant_order_id: order.orderNumber,
      recipient_name: address.fullName as string,
      recipient_phone: address.phone as string,
      recipient_address: addressParts.join(', '),
      recipient_city: recipientCity,
      recipient_zone: recipientZone,
      recipient_area: (address.pathaoAreaId as number | null) || undefined,
      delivery_type: 48, // normal
      item_type: 2, // parcel
      item_quantity: totalItemCount,
      item_weight: totalWeightKg,
      amount_to_collect: isCOD ? order.total : 0,
    })

    // Save consignment ID and delivery fee to order
    const { error: updateError } = await supabase
      .from('Order')
      .update({
        pathaoConsignmentId: result.consignment_id,
        pathaoDeliveryFee: result.delivery_fee,
        shippingCost: result.delivery_fee,
        shippingStatus: 'READY_TO_DISPATCH',
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update order with Pathao data:', updateError)
      // Still return success since Pathao booking succeeded
    }

    return NextResponse.json({
      success: true,
      consignmentId: result.consignment_id,
      deliveryFee: result.delivery_fee,
      message: `Shipment booked with Pathao. Consignment ID: ${result.consignment_id}`,
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error booking Pathao shipment:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to book shipment with Pathao' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/orders/[id]/pathao
 * Check Pathao tracking status for an order
 */
export async function GET(_request: Request, props: RouteParams) {
  try {
    await requireModuleAccess('orders')
    const { id } = await props.params

    const { data: order, error } = await supabase
      .from('Order')
      .select('id, pathaoConsignmentId, shippingStatus')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order.pathaoConsignmentId) {
      return NextResponse.json({ error: 'Order has no Pathao shipment' }, { status: 400 })
    }

    const info = await getPathaoOrderInfo(order.pathaoConsignmentId)
    const mappedStatus = mapPathaoStatusToShippingStatus(info.order_status)

    // Optionally update our shipping status if it has changed
    if (mappedStatus !== order.shippingStatus) {
      await supabase
        .from('Order')
        .update({
          shippingStatus: mappedStatus,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
    }

    return NextResponse.json({
      consignmentId: info.consignment_id,
      pathaoStatus: info.order_status,
      pathaoStatusSlug: info.order_status_slug,
      mappedShippingStatus: mappedStatus,
      deliveryFee: info.delivery_fee,
      updatedAt: info.updated_at,
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error checking Pathao status:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check Pathao status' },
      { status: 500 }
    )
  }
}
