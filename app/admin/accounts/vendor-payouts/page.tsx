'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calculator,
  Wallet,
  DollarSign,
} from 'lucide-react'
import type { VendorPayout, PayoutStatus } from '@/types/accounts'
import PayoutStatusBadge from '@/components/admin/accounts/PayoutStatusBadge'
import VendorPayoutModal from '@/components/admin/accounts/VendorPayoutModal'

export default function VendorPayoutsPage() {
  const [payouts, setPayouts] = useState<VendorPayout[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pendingTotal, setPendingTotal] = useState(0)

  // Filters
  const [vendorFilter, setVendorFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | ''>('')
  const [page, setPage] = useState(1)
  const limit = 20

  // Vendors list
  const [vendors, setVendors] = useState<Array<{ id: string; shopName: string }>>([])

  // Calculate modal
  const [showCalcModal, setShowCalcModal] = useState(false)
  const [calcVendorId, setCalcVendorId] = useState('')
  const [calcPeriodStart, setCalcPeriodStart] = useState('')
  const [calcPeriodEnd, setCalcPeriodEnd] = useState('')
  const [calcResult, setCalcResult] = useState<{
    vendor: { shopName: string }; totalSales: number; commissionRate: number;
    commissionAmount: number; payoutAmount: number; orderCount: number
  } | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [creatingPayout, setCreatingPayout] = useState(false)

  // Mark paid modal
  const [selectedPayout, setSelectedPayout] = useState<VendorPayout | null>(null)

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/admin/vendors?limit=100')
        if (response.ok) {
          const data = await response.json()
          setVendors(data.vendors || [])
        }
      } catch (error) {
        console.error('Error fetching vendors:', error)
      }
    }
    fetchVendors()
  }, [])

  const fetchPayouts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
      if (vendorFilter) params.set('vendorId', vendorFilter)
      if (statusFilter) params.set('status', statusFilter)

      const response = await fetch(`/api/admin/accounts/vendor-payouts?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPayouts(data.payouts || [])
      setTotal(data.total || 0)
      setPendingTotal(data.pendingTotal || 0)
    } catch (error) {
      console.error('Error fetching payouts:', error)
    } finally {
      setLoading(false)
    }
  }, [page, vendorFilter, statusFilter])

  useEffect(() => { fetchPayouts() }, [fetchPayouts])

  const handleCalculate = async () => {
    if (!calcVendorId || !calcPeriodStart || !calcPeriodEnd) return
    setCalculating(true)
    setCalcResult(null)
    try {
      const response = await fetch('/api/admin/accounts/vendor-payouts/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId: calcVendorId, periodStart: calcPeriodStart, periodEnd: calcPeriodEnd }),
      })
      if (!response.ok) throw new Error('Failed to calculate')
      const data = await response.json()
      setCalcResult(data.earnings)
    } catch (error) {
      console.error('Error calculating:', error)
      alert('Failed to calculate vendor earnings')
    } finally {
      setCalculating(false)
    }
  }

  const handleCreatePayout = async () => {
    if (!calcResult || !calcVendorId) return
    setCreatingPayout(true)
    try {
      const response = await fetch('/api/admin/accounts/vendor-payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: calcVendorId,
          periodStart: calcPeriodStart,
          periodEnd: calcPeriodEnd,
          totalSales: calcResult.totalSales,
          commissionRate: calcResult.commissionRate,
          commissionAmount: calcResult.commissionAmount,
          payoutAmount: calcResult.payoutAmount,
        }),
      })
      if (!response.ok) throw new Error('Failed to create payout')
      setShowCalcModal(false)
      setCalcResult(null)
      setCalcVendorId('')
      setCalcPeriodStart('')
      setCalcPeriodEnd('')
      fetchPayouts()
    } catch (error) {
      console.error('Error creating payout:', error)
      alert('Failed to create payout')
    } finally {
      setCreatingPayout(false)
    }
  }

  const handleMarkPaid = async (payoutId: string, reference: string) => {
    const response = await fetch(`/api/admin/accounts/vendor-payouts/${payoutId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    })
    if (!response.ok) throw new Error('Failed to mark as paid')
    fetchPayouts()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>Vendor Payouts</h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>Calculate and track vendor commission payouts</p>
        </div>
        <button
          onClick={() => setShowCalcModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
        >
          <Calculator size={18} />
          Calculate Payouts
        </button>
      </div>

      {/* Pending Total */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: '#EDE9FE' }}>
            <Wallet className="w-8 h-8" style={{ color: '#7C3AED' }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Total Pending Payouts</p>
            <p className="text-3xl font-bold" style={{ color: '#2C2C2C' }}>
              ৳{pendingTotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>Vendor</label>
            <select
              value={vendorFilter}
              onChange={(e) => { setVendorFilter(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.shopName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as PayoutStatus | ''); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div
        className="bg-white rounded-lg shadow-sm"
        style={{ width: '100%', minWidth: '320px', overflow: 'hidden' }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
            <p
              className="mt-4"
              style={{
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Loading payouts...
            </p>
          </div>
        ) : payouts.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p
              className="text-lg mb-2"
              style={{
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              No payouts found
            </p>
            <p
              className="text-sm"
              style={{
                color: '#9CA3AF',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Use &quot;Calculate Payouts&quot; to create vendor payouts
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Vendor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Period</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Sales</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Commission</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Payout</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Status</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: '1px solid #E5E7EB' }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'normal' }}>
                      {payout.vendor?.shopName || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                      {formatDate(payout.periodStart)} - {formatDate(payout.periodEnd)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>
                      ৳{Number(payout.totalSales).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right text-sm" style={{ color: '#DC2626', whiteSpace: 'nowrap' }}>
                      {payout.commissionRate}% (৳{Number(payout.commissionAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })})
                    </td>
                    <td className="px-6 py-4 text-right font-medium" style={{ color: '#059669', whiteSpace: 'nowrap' }}>
                      ৳{Number(payout.payoutAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                      <PayoutStatusBadge status={payout.status} />
                    </td>
                    <td className="px-6 py-4 text-center" style={{ whiteSpace: 'nowrap' }}>
                      {payout.status === 'PENDING' && (
                        <button
                          onClick={() => setSelectedPayout(payout)}
                          className="px-3 py-1.5 rounded text-sm text-white transition-colors"
                          style={{
                            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                          }}
                        >
                          Mark Paid
                        </button>
                      )}
                      {payout.status === 'PAID' && payout.reference && (
                        <span className="text-xs" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                          Ref: {payout.reference}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && payouts.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>Showing {payouts.length} of {total} payouts</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: '#e5e7eb' }}>
              <ChevronLeft size={20} style={{ color: '#6B7280' }} />
            </button>
            <span className="px-4 py-2" style={{ color: '#2C2C2C' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: '#e5e7eb' }}>
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Calculate Modal */}
      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full bg-white rounded-lg shadow-xl p-8"
            style={{ maxWidth: '600px', minWidth: '320px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-serif font-bold"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Calculate Vendor Earnings
              </h2>
              <button onClick={() => { setShowCalcModal(false); setCalcResult(null) }} className="p-2 hover:bg-gray-100 rounded">
                <span style={{ color: '#6B7280', fontSize: 20, lineHeight: 1 }}>&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                >
                  Vendor
                </label>
                <select
                  value={calcVendorId}
                  onChange={(e) => { setCalcVendorId(e.target.value); setCalcResult(null) }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <option value="">Select vendor</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.shopName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                  >
                    Period Start
                  </label>
                  <input
                    type="date"
                    value={calcPeriodStart}
                    onChange={(e) => { setCalcPeriodStart(e.target.value); setCalcResult(null) }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#d1d5db' }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                  >
                    Period End
                  </label>
                  <input
                    type="date"
                    value={calcPeriodEnd}
                    onChange={(e) => { setCalcPeriodEnd(e.target.value); setCalcResult(null) }}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#d1d5db' }}
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={calculating || !calcVendorId || !calcPeriodStart || !calcPeriodEnd}
                className="w-full px-4 py-2 rounded-md text-white transition-colors"
                style={{
                  background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                  cursor: (calculating || !calcVendorId || !calcPeriodStart || !calcPeriodEnd) ? 'not-allowed' : 'pointer',
                  opacity: (calculating || !calcVendorId || !calcPeriodStart || !calcPeriodEnd) ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {calculating ? 'Calculating...' : 'Calculate'}
              </button>

              {calcResult && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5', width: '100%', minWidth: '280px' }}>
                  <h3
                    className="font-medium mb-3"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                      overflowWrap: 'normal',
                    }}
                  >
                    {calcResult.vendor.shopName} Earnings
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Orders</span>
                      <span style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>{calcResult.orderCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Total Sales</span>
                      <span style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>৳{calcResult.totalSales.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Commission ({calcResult.commissionRate}%)</span>
                      <span style={{ color: '#DC2626', whiteSpace: 'nowrap' }}>-৳{calcResult.commissionAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-2" style={{ borderTop: '1px solid #E5E7EB' }}>
                      <div className="flex justify-between">
                        <span className="font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Payout Amount</span>
                        <span className="font-bold" style={{ color: '#059669', whiteSpace: 'nowrap' }}>
                          ৳{calcResult.payoutAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {calcResult.payoutAmount > 0 && (
                    <button
                      onClick={handleCreatePayout}
                      disabled={creatingPayout}
                      className="w-full mt-4 px-4 py-2 rounded-md text-white transition-colors"
                      style={{
                        backgroundColor: '#059669',
                        cursor: creatingPayout ? 'not-allowed' : 'pointer',
                        opacity: creatingPayout ? 0.5 : 1,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {creatingPayout ? 'Creating...' : 'Create Payout Record'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mark Paid Modal */}
      <VendorPayoutModal
        payout={selectedPayout}
        isOpen={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
        onMarkPaid={handleMarkPaid}
      />
    </div>
  )
}
