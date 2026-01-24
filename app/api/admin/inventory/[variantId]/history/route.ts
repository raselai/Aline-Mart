import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import type { InventoryHistoryResponse } from '@/types/inventory'

interface RouteParams {
  params: Promise<{ variantId: string }>
}

/**
 * GET /api/admin/inventory/[variantId]/history
 * Get inventory history for a specific variant
 */
export async function GET(request: NextRequest, props: RouteParams) {
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
    const { variantId } = params

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // First verify the variant exists
    const { data: variant, error: variantError } = await supabase
      .from('ProductVariant')
      .select('id, sku')
      .eq('id', variantId)
      .single()

    if (variantError || !variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      )
    }

    // Build query
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: logs, error, count } = await supabase
      .from('InventoryLog')
      .select(`
        *,
        Product:productId (
          name,
          slug
        ),
        User:adminId (
          name,
          email
        ),
        Order:orderId (
          orderNumber
        )
      `, { count: 'exact' })
      .eq('variantId', variantId)
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Transform data
    const transformedLogs = (logs || []).map((log: any) => ({
      id: log.id,
      variantId: log.variantId,
      productId: log.productId,
      previousStock: log.previousStock,
      newStock: log.newStock,
      changeAmount: log.changeAmount,
      changeType: log.changeType,
      reason: log.reason,
      orderId: log.orderId,
      adminId: log.adminId,
      createdAt: log.createdAt,
      variant: {
        sku: variant.sku
      },
      product: log.Product ? {
        name: log.Product.name,
        slug: log.Product.slug
      } : undefined,
      admin: log.User ? {
        name: log.User.name,
        email: log.User.email
      } : undefined,
      order: log.Order ? {
        orderNumber: log.Order.orderNumber
      } : undefined
    }))

    const response: InventoryHistoryResponse = {
      logs: transformedLogs,
      total: count || 0,
      page,
      limit
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching variant history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variant history' },
      { status: 500 }
    )
  }
}
