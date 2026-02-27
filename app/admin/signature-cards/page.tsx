'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface AdminSignatureCard {
  id: string
  category: string
  cardNumber: string
  cardholderName: string
  balance: number
  purchasePrice: number
  isActive: boolean
  physicalCardStatus: string
  mailingAddress: string
  email: string
  phone: string
  validUntil: string | null
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
}

const CATEGORY_COLORS: Record<string, string> = {
  CROWN: 'bg-amber-100 text-amber-800',
  PRIVILEGE: 'bg-purple-100 text-purple-800',
  CAMPUS: 'bg-blue-100 text-blue-800',
}

export default function AdminSignatureCardsPage() {
  const [cards, setCards] = useState<AdminSignatureCard[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const limit = 20

  useEffect(() => {
    fetchCards()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryFilter, statusFilter])

  async function fetchCards() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (categoryFilter) params.set('category', categoryFilter)
      if (statusFilter) params.set('physicalCardStatus', statusFilter)
      if (search) params.set('search', search)

      const res = await fetch(`/api/admin/signature-cards?${params}`)
      if (res.ok) {
        const data = await res.json()
        setCards(data.cards || [])
        setTotal(data.total || 0)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(cardId: string, newStatus: string) {
    setUpdating(cardId)
    try {
      const res = await fetch(`/api/admin/signature-cards/${cardId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ physicalCardStatus: newStatus }),
      })

      if (res.ok) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === cardId ? { ...c, physicalCardStatus: newStatus } : c
          )
        )
      }
    } catch {
      // silently fail
    } finally {
      setUpdating(null)
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Signature Cards</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or card number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCards()}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/50"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          <option value="CROWN">Crown</option>
          <option value="PRIVILEGE">Privilege</option>
          <option value="CAMPUS">Campus</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No signature cards found</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Cardholder</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Card Number</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Balance</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Physical Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <>
                    <tr
                      key={card.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{card.cardholderName}</p>
                          <p className="text-xs text-gray-400">{card.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{card.cardNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${CATEGORY_COLORS[card.category] || ''}`}>
                          {card.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">৳{Number(card.balance).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${STATUS_COLORS[card.physicalCardStatus] || ''}`}>
                          {card.physicalCardStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={card.physicalCardStatus}
                          onChange={(e) => {
                            e.stopPropagation()
                            updateStatus(card.id, e.target.value)
                          }}
                          disabled={updating === card.id}
                          className="text-xs border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>
                      </td>
                    </tr>
                    {expandedCard === card.id && (
                      <tr key={`${card.id}-details`} className="bg-gray-50">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-gray-400 mb-1">Phone</p>
                              <p>{card.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Mailing Address</p>
                              <p>{card.mailingAddress}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Valid Until</p>
                              <p>{card.validUntil ? new Date(card.validUntil).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Purchase Price</p>
                              <p>৳{Number(card.purchasePrice).toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-xs text-gray-500">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-xs px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-xs px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
