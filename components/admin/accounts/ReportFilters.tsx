'use client'

import type { ReportType } from '@/types/accounts'

interface ReportFiltersProps {
  reportType: ReportType
  dateFrom: string
  dateTo: string
  groupBy: string
  onReportTypeChange: (type: ReportType) => void
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
  onGroupByChange: (groupBy: string) => void
}

export default function ReportFilters({
  reportType,
  dateFrom,
  dateTo,
  groupBy,
  onReportTypeChange,
  onDateFromChange,
  onDateToChange,
  onGroupByChange,
}: ReportFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value as ReportType)}
            className="w-full px-4 py-2 border rounded-md"
            style={{ borderColor: '#d1d5db' }}
          >
            <option value="revenue">Revenue Summary</option>
            <option value="sales">Sales Report</option>
            <option value="refunds">Refund Report</option>
            <option value="payouts">Vendor Payouts</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            style={{ borderColor: '#d1d5db' }}
          />
        </div>

        {reportType === 'revenue' && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => onGroupByChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
