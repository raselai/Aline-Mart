'use client'

import { getStockStatus, getStockStatusStyles, type StockStatus } from '@/types/inventory'

interface LowStockBadgeProps {
  stock: number
  threshold: number
}

export default function LowStockBadge({ stock, threshold }: LowStockBadgeProps) {
  const status = getStockStatus(stock, threshold)
  const styles = getStockStatusStyles(status)

  const labels: Record<Exclude<StockStatus, 'all'>, string> = {
    out_of_stock: 'Out of Stock',
    low_stock: 'Low Stock',
    in_stock: 'In Stock'
  }

  // getStockStatus never returns 'all', so this cast is safe
  const label = labels[status as Exclude<StockStatus, 'all'>]

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
      {label}
    </span>
  )
}
