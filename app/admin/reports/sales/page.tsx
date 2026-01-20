'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  TrendingUp,
  Package,
  DollarSign,
  ShoppingCart
} from 'lucide-react'
import { formatPrice } from '@/lib/order-utils'

interface SalesReportItem {
  id: string
  orderId: string
  orderNumber: string
  orderDate: string
  orderStatus: string
  productId: string
  productName: string
  vendor: string | null
  categoryId: string
  categoryName: string
  subCategoryName: string | null
  brandId: string
  brandName: string
  regularPrice: number
  sellingPrice: number
  costPrice: number | null
  quantity: number
  totalAmount: number
  profit: number | null
}

interface ReportSummary {
  totalOrders: number
  totalItems: number
  totalRevenue: number
  totalCost: number | null
  totalProfit: number | null
  avgOrderValue: number
}

interface Brand {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
  parentId: string | null
}

function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = () => {
    switch (status) {
      case 'PENDING':
        return { backgroundColor: '#FEF3C7', color: '#92400E' }
      case 'PROCESSING':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' }
      case 'SHIPPED':
        return { backgroundColor: '#E0E7FF', color: '#3730A3' }
      case 'DELIVERED':
        return { backgroundColor: '#D1FAE5', color: '#065F46' }
      case 'CANCELLED':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' }
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' }
    }
  }

  const style = getStatusStyle()
  return (
    <span
      className="px-2 py-1 rounded text-xs font-medium"
      style={style}
    >
      {status}
    </span>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  color
}: {
  title: string
  value: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#2C2C2C' }}>{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

export default function SalesReportPage() {
  const [reportData, setReportData] = useState<SalesReportItem[]>([])
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  // Filters
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [vendor, setVendor] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  const [status, setStatus] = useState('')

  // Filter options
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [vendors, setVendors] = useState<string[]>([])

  // Pagination
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 50

  const tableRef = useRef<HTMLTableElement>(null)

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  // Fetch report data when filters change
  useEffect(() => {
    fetchReportData()
  }, [dateFrom, dateTo, vendor, categoryId, brandId, status, page])

  const fetchFilterOptions = async () => {
    try {
      // Fetch brands
      const brandsRes = await fetch('/api/brands')
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json()
        setBrands(brandsData.brands || [])
      }

      // Fetch categories
      const categoriesRes = await fetch('/api/categories')
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.data?.all || [])
      }

      // Fetch products for vendors
      const productsRes = await fetch('/api/products?limit=1000')
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        const uniqueVendors = [...new Set(
          productsData.products
            ?.map((p: any) => p.vendor)
            .filter((v: any) => v && v.trim() !== '')
        )] as string[]
        setVendors(uniqueVendors.sort())
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      if (vendor) params.append('vendor', vendor)
      if (categoryId) params.append('categoryId', categoryId)
      if (brandId) params.append('brandId', brandId)
      if (status) params.append('status', status)

      const response = await fetch(`/api/admin/reports/sales?${params}`)
      if (!response.ok) throw new Error('Failed to fetch report data')

      const data = await response.json()
      setReportData(data.data || [])
      setSummary(data.summary || null)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = async () => {
    setExporting(true)
    try {
      // Fetch all data for export (no pagination)
      const params = new URLSearchParams({ limit: '10000' })
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      if (vendor) params.append('vendor', vendor)
      if (categoryId) params.append('categoryId', categoryId)
      if (brandId) params.append('brandId', brandId)
      if (status) params.append('status', status)

      const response = await fetch(`/api/admin/reports/sales?${params}`)
      if (!response.ok) throw new Error('Failed to fetch export data')

      const data = await response.json()
      const exportData = data.data || []

      // Build CSV content
      const headers = [
        'Order Number',
        'Order Date',
        'Status',
        'Product Name',
        'Vendor/Supplier',
        'Category',
        'Sub Category',
        'Brand',
        'Regular Price',
        'Selling Price',
        'Cost Price',
        'Quantity',
        'Total Amount',
        'Profit'
      ]

      const rows = exportData.map((item: SalesReportItem) => [
        item.orderNumber,
        new Date(item.orderDate).toLocaleDateString(),
        item.orderStatus,
        item.productName,
        item.vendor || '',
        item.categoryName,
        item.subCategoryName || '',
        item.brandName,
        item.regularPrice.toFixed(2),
        item.sellingPrice.toFixed(2),
        item.costPrice?.toFixed(2) || '',
        item.quantity,
        item.totalAmount.toFixed(2),
        item.profit?.toFixed(2) || ''
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map((cell: any) => `"${cell}"`).join(','))
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV')
    } finally {
      setExporting(false)
    }
  }

  const exportToPDF = async () => {
    setExporting(true)
    try {
      // Create a printable version
      const printContent = document.createElement('div')
      printContent.innerHTML = `
        <html>
          <head>
            <title>Sales Report - Aline Mart</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #8e2157; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #8e2157; color: white; }
              tr:nth-child(even) { background-color: #f9f9f9; }
              .summary { display: flex; gap: 20px; margin-bottom: 20px; }
              .summary-item { background: #f5f5f5; padding: 15px; border-radius: 8px; }
              .summary-label { color: #666; font-size: 12px; }
              .summary-value { font-size: 18px; font-weight: bold; color: #2C2C2C; }
              @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
          </head>
          <body>
            <h1>Sales Report</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            ${dateFrom || dateTo ? `<p>Period: ${dateFrom || 'Start'} to ${dateTo || 'Now'}</p>` : ''}

            <div class="summary">
              <div class="summary-item">
                <div class="summary-label">Total Orders</div>
                <div class="summary-value">${summary?.totalOrders || 0}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Items</div>
                <div class="summary-value">${summary?.totalItems || 0}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Revenue</div>
                <div class="summary-value">${formatPrice(summary?.totalRevenue || 0)}</div>
              </div>
              ${summary?.totalProfit !== null ? `
              <div class="summary-item">
                <div class="summary-label">Total Profit</div>
                <div class="summary-value">${formatPrice(summary?.totalProfit || 0)}</div>
              </div>
              ` : ''}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Brand</th>
                  <th>Regular Price</th>
                  <th>Selling Price</th>
                  <th>Cost Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.map(item => `
                  <tr>
                    <td>${item.orderNumber}</td>
                    <td>${new Date(item.orderDate).toLocaleDateString()}</td>
                    <td>${item.orderStatus}</td>
                    <td>${item.productName}</td>
                    <td>${item.vendor || '-'}</td>
                    <td>${item.categoryName}</td>
                    <td>${item.subCategoryName || '-'}</td>
                    <td>${item.brandName}</td>
                    <td>${formatPrice(item.regularPrice)}</td>
                    <td>${formatPrice(item.sellingPrice)}</td>
                    <td>${item.costPrice ? formatPrice(item.costPrice) : '-'}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.totalAmount)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `

      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(printContent.innerHTML)
        printWindow.document.close()
        printWindow.print()
      }
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  const clearFilters = () => {
    setDateFrom('')
    setDateTo('')
    setVendor('')
    setCategoryId('')
    setBrandId('')
    setStatus('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Sales Report
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            View and export sales data by date range
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <button
            onClick={exportToCSV}
            disabled={exporting || reportData.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportToPDF}
            disabled={exporting || reportData.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Total Orders"
            value={summary.totalOrders.toString()}
            icon={ShoppingCart}
            color="#8e2157"
          />
          <SummaryCard
            title="Total Items Sold"
            value={summary.totalItems.toString()}
            icon={Package}
            color="#3B82F6"
          />
          <SummaryCard
            title="Total Revenue"
            value={formatPrice(summary.totalRevenue)}
            icon={DollarSign}
            color="#10B981"
          />
          {summary.totalProfit !== null && (
            <SummaryCard
              title="Total Profit"
              value={formatPrice(summary.totalProfit)}
              icon={TrendingUp}
              color="#F59E0B"
            />
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: '#2C2C2C' }}>
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm hover:underline"
            style={{ color: '#8e2157' }}
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Date From */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              From Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
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
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Vendor/Supplier
            </label>
            <select
              value={vendor}
              onChange={(e) => { setVendor(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Categories</option>
              {categories.filter(c => !c.parentId).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Brand
            </label>
            <select
              value={brandId}
              onChange={(e) => { setBrandId(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading report data...</p>
          </div>
        ) : reportData.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
              No sales data found
            </p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {dateFrom || dateTo || vendor || categoryId || brandId || status
                ? 'Try adjusting your filters'
                : 'Sales data will appear here when orders are placed'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full" style={{ minWidth: '1400px' }}>
              <thead style={{ backgroundColor: '#8e2157' }}>
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Order #</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Product</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Vendor</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Category</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Sub Category</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-white">Brand</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-white">Regular Price</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-white">Selling Price</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-white">Cost Price</th>
                  <th className="text-center px-4 py-3 text-sm font-medium text-white">Qty</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor: '#E5E7EB',
                      backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium" style={{ color: '#8e2157' }}>
                        {item.orderNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#2C2C2C' }}>
                      {new Date(item.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.orderStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium" style={{ color: '#2C2C2C' }}>
                        {item.productName}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#6B7280' }}>
                      {item.vendor || '-'}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#2C2C2C' }}>
                      {item.categoryName}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#6B7280' }}>
                      {item.subCategoryName || '-'}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#2C2C2C' }}>
                      {item.brandName}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: '#6B7280' }}>
                      {formatPrice(item.regularPrice)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: '#2C2C2C' }}>
                      {formatPrice(item.sellingPrice)}
                    </td>
                    <td className="px-4 py-3 text-right" style={{ color: '#6B7280' }}>
                      {item.costPrice ? formatPrice(item.costPrice) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: '#2C2C2C' }}>
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-medium" style={{ color: '#10B981' }}>
                      {formatPrice(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && reportData.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} records
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
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Exporting Overlay */}
      {exporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Exporting report...</p>
          </div>
        </div>
      )}
    </div>
  )
}
