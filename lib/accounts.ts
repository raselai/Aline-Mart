/**
 * Accounts/Finance Management Helper Functions
 * Handles transactions, refunds, COD collections, and vendor payouts
 */

import { supabase } from './supabase'
import type { TransactionType } from '@/types/accounts'

// --- Transaction Helpers ---

export async function createTransaction(params: {
  type: TransactionType
  amount: number
  orderId?: string
  refundId?: string
  vendorPayoutId?: string
  description?: string
  reference?: string
  createdBy?: string
}) {
  const { data, error } = await supabase
    .from('Transaction')
    .insert({
      type: params.type,
      amount: params.amount,
      orderId: params.orderId || null,
      refundId: params.refundId || null,
      vendorPayoutId: params.vendorPayoutId || null,
      description: params.description || null,
      reference: params.reference || null,
      createdBy: params.createdBy || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getTransactionStats() {
  const { data, error } = await supabase
    .from('Transaction')
    .select('type, amount')

  if (error) throw error

  const stats = {
    totalSales: 0,
    totalRefunds: 0,
    totalCODCollections: 0,
    totalVendorPayouts: 0,
    totalAdjustments: 0,
    netRevenue: 0,
  }

  for (const tx of data || []) {
    const amount = Number(tx.amount)
    switch (tx.type) {
      case 'SALE':
        stats.totalSales += amount
        stats.netRevenue += amount
        break
      case 'REFUND':
        stats.totalRefunds += amount
        stats.netRevenue -= amount
        break
      case 'COD_COLLECTION':
        stats.totalCODCollections += amount
        break
      case 'VENDOR_PAYOUT':
        stats.totalVendorPayouts += amount
        stats.netRevenue -= amount
        break
      case 'ADJUSTMENT':
        stats.totalAdjustments += amount
        stats.netRevenue += amount
        break
    }
  }

  return stats
}

// --- Refund Helpers ---

export async function createRefund(params: {
  orderId: string
  orderItemId?: string
  amount: number
  reason: string
  type: 'FULL' | 'PARTIAL'
  restoreStock: boolean
  notes?: string
}) {
  const { data: refund, error } = await supabase
    .from('Refund')
    .insert({
      orderId: params.orderId,
      orderItemId: params.orderItemId || null,
      amount: params.amount,
      reason: params.reason,
      type: params.type,
      restoreStock: params.restoreStock,
      notes: params.notes || null,
      status: 'PENDING',
    })
    .select()
    .single()

  if (error) throw error
  return refund
}

export async function processRefund(
  refundId: string,
  adminId: string,
  action: 'PROCESSED' | 'REJECTED'
) {
  // Get the refund first
  const { data: refund, error: fetchError } = await supabase
    .from('Refund')
    .select('*, order:Order!Refund_orderId_fkey(id, orderNumber, total)')
    .eq('id', refundId)
    .single()

  if (fetchError || !refund) throw fetchError || new Error('Refund not found')

  // Update refund status
  const { error: updateError } = await supabase
    .from('Refund')
    .update({
      status: action,
      processedAt: new Date().toISOString(),
      processedBy: adminId,
    })
    .eq('id', refundId)

  if (updateError) throw updateError

  if (action === 'PROCESSED') {
    // Create a refund transaction
    await createTransaction({
      type: 'REFUND',
      amount: Number(refund.amount),
      orderId: refund.orderId,
      refundId: refundId,
      description: `Refund for order ${refund.order?.orderNumber || refundId}`,
      createdBy: adminId,
    })

    // Update order refund status
    await supabase
      .from('Order')
      .update({ refundStatus: refund.type === 'FULL' ? 'FULLY_REFUNDED' : 'PARTIALLY_REFUNDED' })
      .eq('id', refund.orderId)

    // Restore stock if needed
    if (refund.restoreStock && refund.orderItemId) {
      const { data: orderItem } = await supabase
        .from('OrderItem')
        .select('variantId, quantity')
        .eq('id', refund.orderItemId)
        .single()

      if (orderItem?.variantId) {
        const { data: variant } = await supabase
          .from('ProductVariant')
          .select('stock')
          .eq('id', orderItem.variantId)
          .single()

        if (variant) {
          await supabase
            .from('ProductVariant')
            .update({ stock: variant.stock + orderItem.quantity })
            .eq('id', orderItem.variantId)
        }
      }
    }
  }

  return refund
}

// --- COD Collection Helpers ---

export async function markCODCollected(params: {
  orderId: string
  collectedAmount: number
  notes?: string
  collectedBy: string
}) {
  const status = params.collectedAmount > 0 ? 'COLLECTED' : 'FAILED'

  // Get the COD collection record
  const { data: codRecord, error: fetchError } = await supabase
    .from('CODCollection')
    .select('*')
    .eq('orderId', params.orderId)
    .single()

  if (fetchError || !codRecord) throw fetchError || new Error('COD record not found')

  // Determine status based on amounts
  let finalStatus = status
  if (params.collectedAmount > 0 && params.collectedAmount < Number(codRecord.expectedAmount)) {
    finalStatus = 'PARTIAL'
  }

  // Update COD collection
  const { error: updateError } = await supabase
    .from('CODCollection')
    .update({
      collectedAmount: params.collectedAmount,
      collectedAt: new Date().toISOString(),
      collectedBy: params.collectedBy,
      status: finalStatus,
      notes: params.notes || null,
    })
    .eq('orderId', params.orderId)

  if (updateError) throw updateError

  // Update order COD status
  await supabase
    .from('Order')
    .update({ codCollectionStatus: finalStatus })
    .eq('id', params.orderId)

  // Create a COD_COLLECTION transaction
  if (params.collectedAmount > 0) {
    await createTransaction({
      type: 'COD_COLLECTION',
      amount: params.collectedAmount,
      orderId: params.orderId,
      description: `COD collection: ৳${params.collectedAmount}`,
      createdBy: params.collectedBy,
    })
  }
}

// --- Vendor Payout Helpers ---

export async function calculateVendorEarnings(
  vendorId: string,
  periodStart: string,
  periodEnd: string
) {
  // Get the vendor's commission rate
  const { data: vendor, error: vendorError } = await supabase
    .from('Vendor')
    .select('id, shopName, commissionRate')
    .eq('id', vendorId)
    .single()

  if (vendorError || !vendor) throw vendorError || new Error('Vendor not found')

  // Get products belonging to this vendor
  const { data: products, error: prodError } = await supabase
    .from('Product')
    .select('id')
    .eq('vendorId', vendorId)

  if (prodError) throw prodError

  if (!products || products.length === 0) {
    return {
      vendor,
      totalSales: 0,
      commissionRate: Number(vendor.commissionRate) || 10,
      commissionAmount: 0,
      payoutAmount: 0,
      orderCount: 0,
    }
  }

  const productIds = products.map((p) => p.id)

  // Get order items for these products within the period
  const { data: orderItems, error: itemsError } = await supabase
    .from('OrderItem')
    .select(`
      total,
      order:Order!OrderItem_orderId_fkey(
        id,
        status,
        createdAt
      )
    `)
    .in('productId', productIds)
    .gte('order.createdAt', periodStart)
    .lte('order.createdAt', periodEnd)

  if (itemsError) throw itemsError

  // Sum up total sales from delivered/completed orders
  let totalSales = 0
  let orderCount = 0
  const countedOrders = new Set<string>()

  for (const item of orderItems || []) {
    const order = Array.isArray(item.order) ? item.order[0] : item.order
    if (order && order.status !== 'CANCELLED') {
      totalSales += Number(item.total)
      if (!countedOrders.has(order.id)) {
        countedOrders.add(order.id)
        orderCount++
      }
    }
  }

  const commissionRate = Number(vendor.commissionRate) || 10
  const commissionAmount = (totalSales * commissionRate) / 100
  const payoutAmount = totalSales - commissionAmount

  return {
    vendor,
    totalSales,
    commissionRate,
    commissionAmount,
    payoutAmount,
    orderCount,
  }
}

export async function createVendorPayout(params: {
  vendorId: string
  periodStart: string
  periodEnd: string
  totalSales: number
  commissionRate: number
  commissionAmount: number
  payoutAmount: number
}) {
  const { data, error } = await supabase
    .from('VendorPayout')
    .insert({
      vendorId: params.vendorId,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      totalSales: params.totalSales,
      commissionRate: params.commissionRate,
      commissionAmount: params.commissionAmount,
      payoutAmount: params.payoutAmount,
      status: 'PENDING',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markPayoutPaid(
  payoutId: string,
  adminId: string,
  reference?: string
) {
  // Get the payout
  const { data: payout, error: fetchError } = await supabase
    .from('VendorPayout')
    .select('*, vendor:Vendor!VendorPayout_vendorId_fkey(shopName)')
    .eq('id', payoutId)
    .single()

  if (fetchError || !payout) throw fetchError || new Error('Payout not found')

  // Update payout status
  const { error: updateError } = await supabase
    .from('VendorPayout')
    .update({
      status: 'PAID',
      paidAt: new Date().toISOString(),
      paidBy: adminId,
      reference: reference || null,
    })
    .eq('id', payoutId)

  if (updateError) throw updateError

  // Create a VENDOR_PAYOUT transaction
  await createTransaction({
    type: 'VENDOR_PAYOUT',
    amount: Number(payout.payoutAmount),
    vendorPayoutId: payoutId,
    description: `Vendor payout to ${payout.vendor?.shopName || 'vendor'}`,
    reference: reference,
    createdBy: adminId,
  })

  return payout
}
