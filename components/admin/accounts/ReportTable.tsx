'use client'

import type { RevenueReportRow } from '@/types/accounts'

interface ReportTableProps {
  rows: RevenueReportRow[]
  totals: {
    orderCount: number
    grossRevenue: number
    refunds: number
    netRevenue: number
    codCollections: number
    vendorPayouts: number
  } | null
  loading: boolean
}

export default function ReportTable({ rows, totals, loading }: ReportTableProps) {
  const formatAmount = (amount: number) =>
    `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
        <p className="mt-4" style={{ color: '#6B7280' }}>Generating report...</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-lg mb-2" style={{ color: '#6B7280' }}>No data for selected period</p>
        <p className="text-sm" style={{ color: '#9CA3AF' }}>Try adjusting the date range</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth: '800px' }}>
        <thead style={{ backgroundColor: '#F5F5F5' }}>
          <tr>
            <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Period</th>
            <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Orders</th>
            <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Gross Revenue</th>
            <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Refunds</th>
            <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Payouts</th>
            <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Net Revenue</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
              <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>
                {row.date}
              </td>
              <td className="px-6 py-4 text-center text-sm" style={{ color: '#6B7280' }}>
                {row.orderCount}
              </td>
              <td className="px-6 py-4 text-right text-sm" style={{ color: '#059669' }}>
                {formatAmount(row.grossRevenue)}
              </td>
              <td className="px-6 py-4 text-right text-sm" style={{ color: '#DC2626' }}>
                {row.refunds > 0 ? `-${formatAmount(row.refunds)}` : '—'}
              </td>
              <td className="px-6 py-4 text-right text-sm" style={{ color: '#7C3AED' }}>
                {row.vendorPayouts > 0 ? `-${formatAmount(row.vendorPayouts)}` : '—'}
              </td>
              <td className="px-6 py-4 text-right font-medium" style={{ color: row.netRevenue >= 0 ? '#059669' : '#DC2626' }}>
                {formatAmount(row.netRevenue)}
              </td>
            </tr>
          ))}
        </tbody>
        {totals && (
          <tfoot>
            <tr className="border-t-2" style={{ borderColor: '#2C2C2C', backgroundColor: '#F5F5F5' }}>
              <td className="px-6 py-4 text-sm font-bold" style={{ color: '#2C2C2C' }}>Total</td>
              <td className="px-6 py-4 text-center text-sm font-bold" style={{ color: '#2C2C2C' }}>
                {totals.orderCount}
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: '#059669' }}>
                {formatAmount(totals.grossRevenue)}
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: '#DC2626' }}>
                {totals.refunds > 0 ? `-${formatAmount(totals.refunds)}` : '—'}
              </td>
              <td className="px-6 py-4 text-right text-sm font-bold" style={{ color: '#7C3AED' }}>
                {totals.vendorPayouts > 0 ? `-${formatAmount(totals.vendorPayouts)}` : '—'}
              </td>
              <td className="px-6 py-4 text-right font-bold" style={{ color: totals.netRevenue >= 0 ? '#059669' : '#DC2626' }}>
                {formatAmount(totals.netRevenue)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
