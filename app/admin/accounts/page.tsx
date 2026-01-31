'use client'

import { useState, useEffect } from 'react'
import type { Transaction } from '@/types/accounts'
import FinancialStatCards from '@/components/admin/accounts/FinancialStatCards'
import RevenueChart from '@/components/admin/accounts/RevenueChart'
import PaymentMethodChart from '@/components/admin/accounts/PaymentMethodChart'
import PendingItemsCards from '@/components/admin/accounts/PendingItemsCards'
import TransactionTable from '@/components/admin/accounts/TransactionTable'

interface DashboardStats {
  totalRevenue: number
  netRevenue: number
  totalRefunds: number
  totalPayouts: number
  pendingCOD: number
  pendingCounts: {
    codCollections: number
    refunds: number
    vendorPayouts: number
  }
  revenueByPeriod: Array<{ date: string; amount: number }>
  revenueByPaymentMethod: Array<{ method: string; amount: number; count: number }>
}

export default function AccountsDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/accounts/dashboard?period=${period}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setStats(data.stats)
        setRecentTransactions(data.recentTransactions || [])
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [period])

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
        <p className="mt-4" style={{ color: '#6B7280' }}>Loading financial dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Financial Dashboard
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Overview of revenue, collections, and payouts
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-md"
          style={{ borderColor: '#d1d5db' }}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {stats && (
        <>
          {/* Stat Cards */}
          <div className="mb-6">
            <FinancialStatCards
              totalRevenue={stats.totalRevenue}
              netRevenue={stats.netRevenue}
              totalRefunds={stats.totalRefunds}
              pendingCOD={stats.pendingCOD}
            />
          </div>

          {/* Charts & Pending */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <RevenueChart data={stats.revenueByPeriod} />
            </div>
            <div>
              <PendingItemsCards
                codCollections={stats.pendingCounts.codCollections}
                refunds={stats.pendingCounts.refunds}
                vendorPayouts={stats.pendingCounts.vendorPayouts}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <PaymentMethodChart data={stats.revenueByPaymentMethod} />
          </div>
        </>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <h3 className="text-lg font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Recent Transactions
          </h3>
        </div>
        <TransactionTable transactions={recentTransactions} loading={false} />
      </div>
    </div>
  )
}
