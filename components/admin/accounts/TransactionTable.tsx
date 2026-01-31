'use client'

import type { Transaction } from '@/types/accounts'
import TransactionTypeBadge from './TransactionTypeBadge'

interface TransactionTableProps {
  transactions: Transaction[]
  loading: boolean
}

export default function TransactionTable({ transactions, loading }: TransactionTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatAmount = (amount: number, type: string) => {
    const isExpense = type === 'REFUND' || type === 'VENDOR_PAYOUT'
    const sign = isExpense ? '-' : '+'
    const color = isExpense ? '#DC2626' : '#059669'
    return (
      <span className="font-medium" style={{ color }}>
        {sign}৳{Math.abs(amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
        <p className="mt-4" style={{ color: '#6B7280' }}>Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-lg mb-2" style={{ color: '#6B7280' }}>No transactions found</p>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Transactions will appear here as orders are placed</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth: '800px' }}>
        <thead style={{ backgroundColor: '#F5F5F5' }}>
          <tr>
            <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Date</th>
            <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Type</th>
            <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Description</th>
            <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Order</th>
            <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Reference</th>
            <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="border-t hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#E5E7EB' }}
            >
              <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>
                {formatDate(tx.createdAt)}
              </td>
              <td className="px-6 py-4">
                <TransactionTypeBadge type={tx.type} />
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: '#2C2C2C' }}>
                {tx.description || '—'}
              </td>
              <td className="px-6 py-4 text-sm font-mono" style={{ color: '#8e2157' }}>
                {tx.order?.orderNumber || '—'}
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>
                {tx.reference || '—'}
              </td>
              <td className="px-6 py-4 text-right">
                {formatAmount(Number(tx.amount), tx.type)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
