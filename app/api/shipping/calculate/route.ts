import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getShippingConfig, calculateShippingCost, parseProductWeight } from '@/lib/shipping'

interface ShippingItem {
  productId: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const items: ShippingItem[] = body.items

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 })
    }

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

    const config = await getShippingConfig()
    const shippingCost = calculateShippingCost(config, totalWeightKg)

    return NextResponse.json({ shippingCost, totalWeightKg })
  } catch (error) {
    console.error('Shipping calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate shipping' }, { status: 500 })
  }
}
