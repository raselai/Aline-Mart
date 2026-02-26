import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getPathaoPriceEstimate } from '@/lib/pathao'
import { parseProductWeight } from '@/lib/shipping'

interface ShippingItem {
  productId: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, pathaoCityId, pathaoZoneId } = body as {
      items: ShippingItem[]
      pathaoCityId?: number
      pathaoZoneId?: number
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 })
    }

    // If Pathao location IDs aren't provided, we can't calculate yet
    if (!pathaoCityId || !pathaoZoneId) {
      return NextResponse.json({
        shippingCost: null,
        message: 'Enter shipping address to calculate',
      })
    }

    // Compute total weight for Pathao API
    const productIds = items.map((item) => item.productId)

    const { data: products } = await supabase
      .from('Product')
      .select('id, weight')
      .in('id', productIds)

    const weightMap: Record<string, number> = {}
    if (products) {
      for (const p of products) {
        weightMap[p.id] = parseProductWeight(p.weight)
      }
    }

    let totalWeightKg = 0
    for (const item of items) {
      totalWeightKg += (weightMap[item.productId] ?? 0) * item.quantity
    }

    // Minimum weight of 0.5kg for Pathao
    const itemWeight = Math.max(totalWeightKg, 0.5)

    const storeId = parseInt(process.env.PATHAO_STORE_ID || '0', 10)
    if (!storeId) {
      return NextResponse.json({ error: 'PATHAO_STORE_ID is not configured' }, { status: 500 })
    }

    const estimate = await getPathaoPriceEstimate({
      store_id: storeId,
      item_type: 2,        // parcel
      delivery_type: 48,   // normal delivery
      item_weight: itemWeight,
      recipient_city: pathaoCityId,
      recipient_zone: pathaoZoneId,
    })

    return NextResponse.json({ shippingCost: estimate.price, totalWeightKg })
  } catch (error) {
    console.error('Shipping calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate shipping' }, { status: 500 })
  }
}
