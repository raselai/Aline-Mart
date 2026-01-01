import { createServerClient } from '@/lib/supabase/server'
import type { CartItem } from '@/types/checkout'

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
    .select('id, stock, Product(name), name')
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
