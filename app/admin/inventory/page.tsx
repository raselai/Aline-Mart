'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  History,
  AlertTriangle,
  TrendingDown,
  XCircle,
  ImageOff,
  Settings
} from 'lucide-react'
import type { InventoryVariant, StockStatus, ChangeType, InventoryStats } from '@/types/inventory'
import LowStockBadge from '@/components/admin/inventory/LowStockBadge'
import StockAdjustmentModal from '@/components/admin/inventory/StockAdjustmentModal'
import InventoryHistoryModal from '@/components/admin/inventory/InventoryHistoryModal'

export default function InventoryPage() {
  const [variants, setVariants] = useState<InventoryVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<InventoryStats | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [stockStatus, setStockStatus] = useState<StockStatus>('all')
  const [brandId, setBrandId] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  // Modals
  const [adjustModalVariant, setAdjustModalVariant] = useState<InventoryVariant | null>(null)
  const [historyModalVariant, setHistoryModalVariant] = useState<InventoryVariant | null>(null)

  // Brand & Category lists for filters
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

  // Fetch brands and categories for filters
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/categories')
        ])

        if (brandsRes.ok) {
          const data = await brandsRes.json()
          // API returns { success: true, data: [...] }
          const brandsList = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])
          setBrands(brandsList)
        }
        if (categoriesRes.ok) {
          const data = await categoriesRes.json()
          // API returns { success: true, data: { all: [...], tree: [...] } }
          const categoriesList = Array.isArray(data.data?.all) ? data.data.all : (Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []))
          setCategories(categoriesList)
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      }
    }

    fetchFiltersData()
  }, [])

  // Fetch inventory
  const fetchInventory = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (search) params.set('search', search)
      if (stockStatus !== 'all') params.set('stockStatus', stockStatus)
      if (brandId) params.set('brandId', brandId)
      if (categoryId) params.set('categoryId', categoryId)

      const response = await fetch(`/api/admin/inventory?${params}`)
      if (!response.ok) throw new Error('Failed to fetch inventory')

      const data = await response.json()
      setVariants(data.variants || [])
      setTotal(data.total || 0)
      setStats(data.stats || null)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }, [page, search, stockStatus, brandId, categoryId])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchInventory()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleStockAdjust = async (adjustment: number, changeType: ChangeType, reason: string) => {
    if (!adjustModalVariant) return

    const response = await fetch(`/api/admin/inventory/${adjustModalVariant.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adjustment, changeType, reason })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to adjust stock')
    }

    // Refresh data
    fetchInventory()
  }

  const handleQuickAdjust = async (variant: InventoryVariant, adjustment: number) => {
    if (variant.stock + adjustment < 0) return

    try {
      const response = await fetch(`/api/admin/inventory/${variant.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adjustment,
          changeType: 'MANUAL_ADJUSTMENT',
          reason: `Quick adjust: ${adjustment > 0 ? '+' : ''}${adjustment}`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to adjust stock')
      }

      fetchInventory()
    } catch (error) {
      console.error('Error adjusting stock:', error)
      alert('Failed to adjust stock')
    }
  }

  const totalPages = Math.ceil(total / limit)

  const getVariantName = (variant: InventoryVariant) => {
    const parts: string[] = []
    if (variant.color) parts.push(variant.color)
    if (variant.size) parts.push(variant.size)
    return parts.length > 0 ? parts.join(' / ') : 'Default'
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-3xl font-serif font-bold"
            style={{ color: '#2C2C2C' }}
          >
            Inventory
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Track and manage product stock levels
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#6B7280' }}>Total Variants</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2C2C2C' }}>
                  {stats.totalVariants}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#F3F4F6' }}>
                <Package className="w-6 h-6" style={{ color: '#6B7280' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#6B7280' }}>In Stock</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#059669' }}>
                  {stats.totalInStock}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#D1FAE5' }}>
                <Package className="w-6 h-6" style={{ color: '#059669' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#6B7280' }}>Low Stock</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#D97706' }}>
                  {stats.totalLowStock}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
                <TrendingDown className="w-6 h-6" style={{ color: '#D97706' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: '#6B7280' }}>Out of Stock</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#DC2626' }}>
                  {stats.totalOutOfStock}
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: '#FEE2E2' }}>
                <XCircle className="w-6 h-6" style={{ color: '#DC2626' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Search
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#6B7280' }}
              />
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Product name or SKU..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <label htmlFor="stockStatus" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Stock Status
            </label>
            <select
              id="stockStatus"
              value={stockStatus}
              onChange={(e) => { setStockStatus(e.target.value as StockStatus); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Brand
            </label>
            <select
              id="brand"
              value={brandId}
              onChange={(e) => { setBrandId(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading inventory...</p>
          </div>
        ) : variants.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
              No inventory items found
            </p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {search || stockStatus !== 'all' || brandId || categoryId
                ? 'Try adjusting your filters'
                : 'Add products to see inventory'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '900px' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>SKU</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Brand</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Stock</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Status</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Quick Adjust</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr
                    key={variant.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                          {variant.product.images?.[0]?.url ? (
                            <Image
                              src={variant.product.images[0].url}
                              alt={variant.product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageOff className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#2C2C2C' }}>
                            {variant.product.name}
                          </p>
                          <p className="text-sm" style={{ color: '#6B7280' }}>
                            {getVariantName(variant)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm" style={{ color: '#6B7280' }}>
                        {variant.sku}
                      </p>
                    </td>

                    {/* Brand */}
                    <td className="px-6 py-4">
                      <p style={{ color: '#8e2157' }}>
                        {variant.product.brand.name}
                      </p>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4 text-center">
                      <p className="text-xl font-bold" style={{ color: '#2C2C2C' }}>
                        {variant.stock}
                      </p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>
                        Threshold: {variant.lowStockThreshold}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <LowStockBadge stock={variant.stock} threshold={variant.lowStockThreshold} />
                    </td>

                    {/* Quick Adjust */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleQuickAdjust(variant, -1)}
                          disabled={variant.stock <= 0}
                          className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          style={{ borderColor: '#e5e7eb' }}
                          title="Decrease by 1"
                        >
                          <Minus className="w-4 h-4" style={{ color: '#6B7280' }} />
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(variant, 1)}
                          className="p-2 rounded border hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#e5e7eb' }}
                          title="Increase by 1"
                        >
                          <Plus className="w-4 h-4" style={{ color: '#6B7280' }} />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setAdjustModalVariant(variant)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="Adjust stock"
                        >
                          <Settings className="w-4 h-4" style={{ color: '#6B7280' }} />
                        </button>
                        <button
                          onClick={() => setHistoryModalVariant(variant)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="View history"
                        >
                          <History className="w-4 h-4" style={{ color: '#6B7280' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && variants.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>
            Showing {variants.length} of {total} items
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

      {/* Low Stock Warning */}
      {stats && stats.totalLowStock > 0 && (
        <div className="mt-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#FEF3C7' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
          <p className="text-sm" style={{ color: '#92400E' }}>
            <strong>{stats.totalLowStock} items</strong> are running low on stock.
            {stats.totalOutOfStock > 0 && (
              <> <strong>{stats.totalOutOfStock} items</strong> are out of stock.</>
            )}
          </p>
        </div>
      )}

      {/* Modals */}
      <StockAdjustmentModal
        variant={adjustModalVariant}
        isOpen={!!adjustModalVariant}
        onClose={() => setAdjustModalVariant(null)}
        onSubmit={handleStockAdjust}
      />

      <InventoryHistoryModal
        variant={historyModalVariant}
        isOpen={!!historyModalVariant}
        onClose={() => setHistoryModalVariant(null)}
      />
    </div>
  )
}
