import { NextRequest, NextResponse } from 'next/server'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import { bulkUpdateStock } from '@/lib/inventory'
import type { ChangeType, BulkUpdateRequest, BulkUpdateResponse } from '@/types/inventory'

/**
 * POST /api/admin/inventory/bulk-update
 * Bulk update stock for multiple variants
 */
export async function POST(request: NextRequest) {
  try {
    const admin = await requireModuleAccess('inventory')

    const body = await request.json() as BulkUpdateRequest
    const { updates, reason, changeType } = body

    // Validate request
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'updates array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (updates.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 updates allowed per request' },
        { status: 400 }
      )
    }

    // Validate each update
    for (const update of updates) {
      if (!update.variantId) {
        return NextResponse.json(
          { error: 'Each update must have a variantId' },
          { status: 400 }
        )
      }
      if (typeof update.newStock !== 'number' || update.newStock < 0) {
        return NextResponse.json(
          { error: `Invalid newStock value for variant ${update.variantId}. Must be a non-negative number.` },
          { status: 400 }
        )
      }
    }

    // Default change type for bulk updates
    const effectiveChangeType: ChangeType = changeType || 'BULK_UPDATE'

    const validChangeTypes: ChangeType[] = [
      'BULK_UPDATE',
      'RESTOCK',
      'MANUAL_ADJUSTMENT'
    ]

    if (!validChangeTypes.includes(effectiveChangeType)) {
      return NextResponse.json(
        { error: `Invalid changeType. Must be one of: ${validChangeTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Perform bulk update
    const result = await bulkUpdateStock(
      updates,
      effectiveChangeType,
      reason,
      admin.id
    )

    const response: BulkUpdateResponse = {
      success: result.success,
      updatedCount: result.updatedCount,
      logs: [], // We don't return logs for bulk updates to keep response size small
      errors: result.errors.length > 0 ? result.errors : undefined
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error in bulk update:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk update' },
      { status: 500 }
    )
  }
}
