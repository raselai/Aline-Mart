import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import type { ChangeType, InventoryHistoryResponse } from '@/types/inventory'

/**
 * GET /api/admin/inventory/history
 * Get global inventory audit log
 * Supports filtering by change type, date range, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const admin = await requireModuleAccess('inventory')

    const searchParams = request.nextUrl.searchParams
    const changeType = searchParams.get('changeType') as ChangeType | null
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('InventoryLog')
      .select(`
        *,
        ProductVariant:variantId (
          sku,
          color,
          size
        ),
        Product:productId (
          name,
          slug
        ),
        User:adminId (
          name,
          email
        )
      `, { count: 'exact' })
      .order('createdAt', { ascending: false })

    // Apply change type filter
    if (changeType) {
      query = query.eq('changeType', changeType)
    }

    // Apply date range filter
    if (startDate) {
      query = query.gte('createdAt', startDate)
    }
    if (endDate) {
      // Add one day to include the end date
      const endDateTime = new Date(endDate)
      endDateTime.setDate(endDateTime.getDate() + 1)
      query = query.lt('createdAt', endDateTime.toISOString())
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: logs, error, count } = await query

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
      variant: log.ProductVariant ? {
        sku: log.ProductVariant.sku,
        color: log.ProductVariant.color,
        size: log.ProductVariant.size
      } : undefined,
      product: log.Product ? {
        name: log.Product.name,
        slug: log.Product.slug
      } : undefined,
      admin: log.User ? {
        name: log.User.name,
        email: log.User.email
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
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching inventory history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory history' },
      { status: 500 }
    )
  }
}
