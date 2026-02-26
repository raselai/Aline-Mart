import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import { adjustStock, updateLowStockThreshold } from '@/lib/inventory'
import type { ChangeType, AdjustStockResponse } from '@/types/inventory'

interface RouteParams {
  params: Promise<{ variantId: string }>
}

/**
 * GET /api/admin/inventory/[variantId]
 * Get detailed inventory info for a specific variant
 */
export async function GET(request: NextRequest, props: RouteParams) {
  try {
    const admin = await requireModuleAccess('inventory')

    const params = await props.params
    const { variantId } = params

    const { data: variant, error } = await supabase
      .from('ProductVariant')
      .select(`
        id,
        sku,
        color,
        size,
        stock,
        lowStockThreshold,
        productId,
        Product:productId (
          id,
          name,
          slug,
          ProductImage (
            url,
            order
          ),
          Brand:brandId (
            id,
            name,
            slug
          ),
          Category:categoryId (
            id,
            name,
            slug
          )
        )
      `)
      .eq('id', variantId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Variant not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Transform data
    const transformedVariant = {
      id: variant.id,
      sku: variant.sku,
      color: variant.color,
      size: variant.size,
      stock: variant.stock,
      lowStockThreshold: variant.lowStockThreshold || 10,
      productId: variant.productId,
      product: {
        id: (variant.Product as any)?.id || '',
        name: (variant.Product as any)?.name || 'Unknown',
        slug: (variant.Product as any)?.slug || '',
        images: ((variant.Product as any)?.ProductImage || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
        brand: {
          id: (variant.Product as any)?.Brand?.id || '',
          name: (variant.Product as any)?.Brand?.name || 'Unknown',
          slug: (variant.Product as any)?.Brand?.slug || ''
        },
        category: {
          id: (variant.Product as any)?.Category?.id || '',
          name: (variant.Product as any)?.Category?.name || 'Unknown',
          slug: (variant.Product as any)?.Category?.slug || ''
        }
      }
    }

    return NextResponse.json({ variant: transformedVariant })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching variant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch variant' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/inventory/[variantId]
 * Adjust stock for a variant
 */
export async function PATCH(request: NextRequest, props: RouteParams) {
  try {
    const admin = await requireModuleAccess('inventory')

    const params = await props.params
    const { variantId } = params
    const body = await request.json()

    const { adjustment, reason, changeType, lowStockThreshold } = body as {
      adjustment?: number
      reason?: string
      changeType?: ChangeType
      lowStockThreshold?: number
    }

    // Update low stock threshold if provided
    if (lowStockThreshold !== undefined) {
      if (lowStockThreshold < 0) {
        return NextResponse.json(
          { error: 'Low stock threshold cannot be negative' },
          { status: 400 }
        )
      }
      await updateLowStockThreshold(variantId, lowStockThreshold)
    }

    // Adjust stock if adjustment provided
    if (adjustment !== undefined && adjustment !== 0) {
      if (!changeType) {
        return NextResponse.json(
          { error: 'changeType is required for stock adjustments' },
          { status: 400 }
        )
      }

      const validChangeTypes: ChangeType[] = [
        'MANUAL_ADJUSTMENT',
        'RETURN',
        'DAMAGED',
        'RESTOCK'
      ]

      if (!validChangeTypes.includes(changeType)) {
        return NextResponse.json(
          { error: `Invalid changeType. Must be one of: ${validChangeTypes.join(', ')}` },
          { status: 400 }
        )
      }

      try {
        const { previousStock, newStock } = await adjustStock(
          variantId,
          adjustment,
          changeType,
          reason,
          admin.id
        )

        // Get updated variant info
        const { data: variant } = await supabase
          .from('ProductVariant')
          .select('id, sku')
          .eq('id', variantId)
          .single()

        // Get the latest log entry
        const { data: log } = await supabase
          .from('InventoryLog')
          .select('*')
          .eq('variantId', variantId)
          .order('createdAt', { ascending: false })
          .limit(1)
          .single()

        const response: AdjustStockResponse = {
          success: true,
          variant: {
            id: variantId,
            sku: variant?.sku || '',
            previousStock,
            newStock
          },
          log: log
        }

        return NextResponse.json(response)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        )
      }
    }

    // If only threshold was updated
    if (lowStockThreshold !== undefined) {
      return NextResponse.json({
        success: true,
        message: 'Low stock threshold updated'
      })
    }

    return NextResponse.json(
      { error: 'No valid updates provided' },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error adjusting stock:', error)
    return NextResponse.json(
      { error: 'Failed to adjust stock' },
      { status: 500 }
    )
  }
}
