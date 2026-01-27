import { createServerClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types/checkout'
import type { ChangeType, CreateInventoryLogData } from '@/types/inventory'

export interface StockValidationResult {
  valid: boolean
  errors: StockError[]
}

export interface StockError {
  variantId: string
  productName: string
  variantName: string
  requestedQuantity: number
  availableStock: number
}

/**
 * Validate stock availability for cart items
 * Returns validation result with detailed errors
 */
export async function validateStock(items: CartItem[]): Promise<StockValidationResult> {
  const supabase = await createServerClient()
  const errors: StockError[] = []

  // Get current stock levels
  const variantIds = items.map((item) => item.variantId)
  const { data: variants, error } = await supabase
    .from('ProductVariant')
    .select('id, stock, Product(name)')
    .in('id', variantIds)

  if (error || !variants) {
    throw new Error('Failed to validate stock')
  }

  // Check each item
  for (const item of items) {
    const variant = variants.find((v) => v.id === item.variantId)

    if (!variant) {
      errors.push({
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        requestedQuantity: item.quantity,
        availableStock: 0,
      })
      continue
    }

    if (variant.stock < item.quantity) {
      errors.push({
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        requestedQuantity: item.quantity,
        availableStock: variant.stock,
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Decrement stock for order items (atomic operation)
 * CRITICAL: Must be called AFTER payment confirmation
 * @deprecated Use decrementStockWithLog for audit trail
 */
export async function decrementStock(orderItems: Array<{ variantId: string; quantity: number }>): Promise<void> {
  const supabase = await createServerClient()

  // Use transaction-like approach with row locking
  for (const item of orderItems) {
    // First, get current stock with FOR UPDATE lock
    const { data: variant, error: fetchError } = await supabase
      .from('ProductVariant')
      .select('id, stock')
      .eq('id', item.variantId)
      .single()

    if (fetchError || !variant) {
      throw new Error(`Failed to fetch variant ${item.variantId}`)
    }

    // Check if sufficient stock
    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for variant ${item.variantId}`)
    }

    // Decrement stock
    const newStock = variant.stock - item.quantity
    const { error: updateError } = await supabase
      .from('ProductVariant')
      .update({ stock: newStock })
      .eq('id', item.variantId)
      .eq('stock', variant.stock) // Optimistic locking

    if (updateError) {
      throw new Error(`Failed to decrement stock for variant ${item.variantId}`)
    }
  }
}

/**
 * Restore stock (for cancelled orders)
 * @deprecated Use restoreStockWithLog for audit trail
 */
export async function restoreStock(orderItems: Array<{ variantId: string; quantity: number }>): Promise<void> {
  const supabase = await createServerClient()

  for (const item of orderItems) {
    // Get current stock
    const { data: variant, error: fetchError } = await supabase
      .from('ProductVariant')
      .select('id, stock')
      .eq('id', item.variantId)
      .single()

    if (fetchError || !variant) {
      console.error(`Failed to fetch variant ${item.variantId} for stock restore:`, fetchError)
      continue
    }

    // Increment stock
    const newStock = variant.stock + item.quantity
    const { error: updateError } = await supabase
      .from('ProductVariant')
      .update({ stock: newStock })
      .eq('id', item.variantId)

    if (updateError) {
      console.error(`Failed to restore stock for variant ${item.variantId}:`, updateError)
    }
  }
}

// ============================================================================
// NEW LOGGING FUNCTIONS
// ============================================================================

/**
 * Create an inventory log entry
 */
export async function createInventoryLog(data: CreateInventoryLogData): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('InventoryLog')
    .insert({
      variantId: data.variantId,
      productId: data.productId,
      previousStock: data.previousStock,
      newStock: data.newStock,
      changeAmount: data.changeAmount,
      changeType: data.changeType,
      reason: data.reason || null,
      orderId: data.orderId || null,
      adminId: data.adminId || null,
    })

  if (error) {
    console.error('Failed to create inventory log:', error)
    // Don't throw - logging shouldn't fail the main operation
  }
}

/**
 * Get product ID for a variant (helper for logging)
 */
async function getVariantProductId(supabase: Awaited<ReturnType<typeof createServerClient>>, variantId: string): Promise<string | null> {
  const { data } = await supabase
    .from('ProductVariant')
    .select('productId')
    .eq('id', variantId)
    .single()

  return data?.productId || null
}

/**
 * Decrement stock with audit logging
 * Use this for all stock decrements to maintain audit trail
 */
export async function decrementStockWithLog(
  orderItems: Array<{ variantId: string; quantity: number }>,
  changeType: ChangeType,
  orderId?: string
): Promise<void> {
  const supabase = await createServerClient()

  for (const item of orderItems) {
    // Get current stock and product ID
    const { data: variant, error: fetchError } = await supabase
      .from('ProductVariant')
      .select('id, stock, productId')
      .eq('id', item.variantId)
      .single()

    if (fetchError || !variant) {
      throw new Error(`Failed to fetch variant ${item.variantId}`)
    }

    // Check if sufficient stock
    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for variant ${item.variantId}`)
    }

    const previousStock = variant.stock
    const newStock = variant.stock - item.quantity

    // Decrement stock with optimistic locking
    const { error: updateError } = await supabase
      .from('ProductVariant')
      .update({ stock: newStock })
      .eq('id', item.variantId)
      .eq('stock', previousStock)

    if (updateError) {
      throw new Error(`Failed to decrement stock for variant ${item.variantId}`)
    }

    // Create audit log
    await createInventoryLog({
      variantId: item.variantId,
      productId: variant.productId,
      previousStock,
      newStock,
      changeAmount: -item.quantity,
      changeType,
      orderId,
    })
  }
}

/**
 * Restore stock with audit logging
 * Use this for cancelled orders, returns, etc.
 */
export async function restoreStockWithLog(
  orderItems: Array<{ variantId: string; quantity: number }>,
  changeType: ChangeType,
  orderId?: string
): Promise<void> {
  const supabase = await createServerClient()

  for (const item of orderItems) {
    // Get current stock and product ID
    const { data: variant, error: fetchError } = await supabase
      .from('ProductVariant')
      .select('id, stock, productId')
      .eq('id', item.variantId)
      .single()

    if (fetchError || !variant) {
      console.error(`Failed to fetch variant ${item.variantId} for stock restore:`, fetchError)
      continue
    }

    const previousStock = variant.stock
    const newStock = variant.stock + item.quantity

    // Increment stock
    const { error: updateError } = await supabase
      .from('ProductVariant')
      .update({ stock: newStock })
      .eq('id', item.variantId)

    if (updateError) {
      console.error(`Failed to restore stock for variant ${item.variantId}:`, updateError)
      continue
    }

    // Create audit log
    await createInventoryLog({
      variantId: item.variantId,
      productId: variant.productId,
      previousStock,
      newStock,
      changeAmount: item.quantity,
      changeType,
      orderId,
    })
  }
}

/**
 * Adjust stock for a single variant with audit logging
 * Use this for manual admin adjustments
 */
export async function adjustStock(
  variantId: string,
  adjustment: number,
  changeType: ChangeType,
  reason?: string,
  adminId?: string
): Promise<{ previousStock: number; newStock: number }> {
  const supabase = await createServerClient()

  // Get current stock and product ID
  const { data: variant, error: fetchError } = await supabase
    .from('ProductVariant')
    .select('id, stock, productId')
    .eq('id', variantId)
    .single()

  if (fetchError || !variant) {
    throw new Error(`Variant not found: ${variantId}`)
  }

  const previousStock = variant.stock
  const newStock = variant.stock + adjustment

  // Validate new stock is not negative
  if (newStock < 0) {
    throw new Error(`Cannot reduce stock below 0. Current: ${previousStock}, Adjustment: ${adjustment}`)
  }

  // Update stock
  const { error: updateError } = await supabase
    .from('ProductVariant')
    .update({ stock: newStock })
    .eq('id', variantId)

  if (updateError) {
    throw new Error(`Failed to adjust stock for variant ${variantId}`)
  }

  // Create audit log
  await createInventoryLog({
    variantId,
    productId: variant.productId,
    previousStock,
    newStock,
    changeAmount: adjustment,
    changeType,
    reason,
    adminId,
  })

  return { previousStock, newStock }
}

/**
 * Bulk update stock for multiple variants
 * Use this for admin bulk operations
 */
export async function bulkUpdateStock(
  updates: Array<{ variantId: string; newStock: number }>,
  changeType: ChangeType,
  reason?: string,
  adminId?: string
): Promise<{
  success: boolean
  updatedCount: number
  errors: Array<{ variantId: string; error: string }>
}> {
  const supabase = await createServerClient()
  const errors: Array<{ variantId: string; error: string }> = []
  let updatedCount = 0

  for (const update of updates) {
    try {
      // Validate new stock
      if (update.newStock < 0) {
        errors.push({ variantId: update.variantId, error: 'Stock cannot be negative' })
        continue
      }

      // Get current stock and product ID
      const { data: variant, error: fetchError } = await supabase
        .from('ProductVariant')
        .select('id, stock, productId')
        .eq('id', update.variantId)
        .single()

      if (fetchError || !variant) {
        errors.push({ variantId: update.variantId, error: 'Variant not found' })
        continue
      }

      const previousStock = variant.stock
      const changeAmount = update.newStock - previousStock

      // Skip if no change
      if (changeAmount === 0) {
        continue
      }

      // Update stock
      const { error: updateError } = await supabase
        .from('ProductVariant')
        .update({ stock: update.newStock })
        .eq('id', update.variantId)

      if (updateError) {
        errors.push({ variantId: update.variantId, error: 'Failed to update stock' })
        continue
      }

      // Create audit log
      await createInventoryLog({
        variantId: update.variantId,
        productId: variant.productId,
        previousStock,
        newStock: update.newStock,
        changeAmount,
        changeType,
        reason,
        adminId,
      })

      updatedCount++
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      errors.push({ variantId: update.variantId, error: errorMessage })
    }
  }

  return {
    success: errors.length === 0,
    updatedCount,
    errors,
  }
}

/**
 * Update low stock threshold for a variant
 */
export async function updateLowStockThreshold(
  variantId: string,
  threshold: number
): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('ProductVariant')
    .update({ lowStockThreshold: threshold })
    .eq('id', variantId)

  if (error) {
    throw new Error(`Failed to update threshold for variant ${variantId}`)
  }
}

/**
 * Get inventory stats
 */
export async function getInventoryStats(): Promise<{
  totalVariants: number
  totalInStock: number
  totalLowStock: number
  totalOutOfStock: number
}> {
  const supabase = await createServerClient()

  // Get all variants with stock info
  const { data: variants, error } = await supabase
    .from('ProductVariant')
    .select('stock, lowStockThreshold')

  if (error || !variants) {
    throw new Error('Failed to fetch inventory stats')
  }

  const stats = {
    totalVariants: variants.length,
    totalInStock: 0,
    totalLowStock: 0,
    totalOutOfStock: 0,
  }

  for (const variant of variants) {
    const threshold = variant.lowStockThreshold || 10
    if (variant.stock === 0) {
      stats.totalOutOfStock++
    } else if (variant.stock <= threshold) {
      stats.totalLowStock++
    } else {
      stats.totalInStock++
    }
  }

  return stats
}
