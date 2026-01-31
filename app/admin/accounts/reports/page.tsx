'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, FileText } from 'lucide-react'
import type { ReportType, RevenueReportRow } from '@/types/accounts'
import ReportFilters from '@/components/admin/accounts/ReportFilters'
import ReportTable from '@/components/admin/accounts/ReportTable'

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('revenue')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [groupBy, setGroupBy] = useState('day')
  const [rows, setRows] = useState<RevenueReportRow[]>([])
  const [totals, setTotals] = useState<{
    orderCount: number; grossRevenue: number; refunds: number;
    netRevenue: number; codCollections: number; vendorPayouts: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Set default dates (last 30 days)
  useEffect(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(now.getDate() - 30)
    setDateTo(now.toISOString().substring(0, 10))
    setDateFrom(thirtyDaysAgo.toISOString().substring(0, 10))
  }, [])

  const fetchReport = useCallback(async () => {
    if (!dateFrom || !dateTo) return
    if (reportType !== 'revenue') {
      setRows([])
      setTotals(null)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({
        dateFrom,
        dateTo,
        groupBy,
      })

      const response = await fetch(`/api/admin/accounts/reports/revenue?${params}`)
      if (!response.ok) throw new Error('Failed to fetch report')
      const data = await response.json()
      setRows(data.rows || [])
      setTotals(data.totals || null)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }, [reportType, dateFrom, dateTo, groupBy])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({ type: reportType })
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const response = await fetch(`/api/admin/accounts/reports/export?${params}`)
      if (!response.ok) throw new Error('Failed to export')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportType}-report-${new Date().toISOString().substring(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting:', error)
      alert('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Financial Reports
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Generate and export financial reports
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
        >
          <Download size={18} />
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <ReportFilters
        reportType={reportType}
        dateFrom={dateFrom}
        dateTo={dateTo}
        groupBy={groupBy}
        onReportTypeChange={setReportType}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onGroupByChange={setGroupBy}
      />

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {reportType === 'revenue' ? (
          <ReportTable rows={rows} totals={totals} loading={loading} />
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
              {reportType === 'sales' && 'Sales Report'}
              {reportType === 'refunds' && 'Refund Report'}
              {reportType === 'payouts' && 'Vendor Payouts Report'}
            </p>
            <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>
              Click "Export CSV" to download the {reportType} report for the selected period
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
            >
              <Download size={18} />
              {exporting ? 'Exporting...' : `Export ${reportType} Report`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
