'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Receipt,
  Calendar,
} from 'lucide-react'
import type { Transaction, TransactionType } from '@/types/accounts'
import TransactionTable from '@/components/admin/accounts/TransactionTable'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters
  const [type, setType] = useState<TransactionType | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  // Modal for manual adjustment
  const [showAddModal, setShowAddModal] = useState(false)
  const [formType, setFormType] = useState<TransactionType>('ADJUSTMENT')
  const [formAmount, setFormAmount] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formReference, setFormReference] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (type) params.set('type', type)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/accounts/transactions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch transactions')

      const data = await response.json()
      setTransactions(data.transactions || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }, [page, type, dateFrom, dateTo, search])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formAmount || Number(formAmount) === 0) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/admin/accounts/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          amount: Number(formAmount),
          description: formDescription,
          reference: formReference,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create transaction')
      }

      setShowAddModal(false)
      setFormAmount('')
      setFormDescription('')
      setFormReference('')
      fetchTransactions()
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert(error instanceof Error ? error.message : 'Failed to create transaction')
    } finally {
      setSubmitting(false)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Transaction Ledger
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            All financial transactions recorded in the system
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
          style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
        >
          <Plus size={18} />
          Manual Entry
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Search
            </label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Description or reference..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value as TransactionType | ''); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Types</option>
              <option value="SALE">Sale</option>
              <option value="REFUND">Refund</option>
              <option value="COD_COLLECTION">COD Collection</option>
              <option value="VENDOR_PAYOUT">Vendor Payout</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              From Date
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              To Date
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <TransactionTable transactions={transactions} loading={loading} />
      </div>

      {/* Pagination */}
      {!loading && transactions.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>
            Showing {transactions.length} of {total} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronLeft size={20} style={{ color: '#6B7280' }} />
            </button>
            <span className="px-4 py-2" style={{ color: '#2C2C2C' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full bg-white rounded-lg shadow-xl p-8"
            style={{ maxWidth: '600px', minWidth: '320px' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-xl font-serif font-bold"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Manual Transaction
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded">
                <X size={20} style={{ color: '#6B7280' }} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                >
                  Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as TransactionType)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <option value="ADJUSTMENT">Adjustment</option>
                  <option value="SALE">Sale</option>
                  <option value="REFUND">Refund</option>
                  <option value="COD_COLLECTION">COD Collection</option>
                  <option value="VENDOR_PAYOUT">Vendor Payout</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                >
                  Amount (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                >
                  Description
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Description of the transaction"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: '#d1d5db',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                >
                  Reference
                </label>
                <input
                  type="text"
                  value={formReference}
                  onChange={(e) => setFormReference(e.target.value)}
                  placeholder="Optional reference number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{
                    borderColor: '#d1d5db',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border rounded-md transition-colors"
                  style={{
                    borderColor: '#d1d5db',
                    color: '#6B7280',
                    backgroundColor: '#ffffff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-md text-white transition-colors"
                  style={{
                    background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.5 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
