'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, Copy, Download } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  salePrice: number | null
  brand: {
    id: string
    name: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  images: {
    url: string
    alt: string | null
  }[]
  inStock: boolean
  featured: boolean
  createdAt: string
  variants?: {
    id: string
    stock: number
  }[]
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Brand {
  id: string
  name: string
  slug: string
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStock, setFilterStock] = useState('')
  const [filterVendor, setFilterVendor] = useState('')
  const [exporting, setExporting] = useState(false)

  // Fetch filters on mount
  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, filterBrand, filterCategory, filterStock, filterVendor])

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ])

      if (!categoriesRes.ok) throw new Error('Failed to fetch categories')
      if (!brandsRes.ok) throw new Error('Failed to fetch brands')

      const categoriesData = await categoriesRes.json()
      const brandsData = await brandsRes.json()
      setCategories(categoriesData.data?.all || [])
      setBrands(brandsData.data || [])
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        brand: filterBrand,
        category: filterCategory,
        stock: filterStock,
        vendor: filterVendor,
      })

      const response = await fetch(`/api/admin/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete product')

      // Refresh the product list
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        brand: filterBrand,
        category: filterCategory,
        stock: filterStock,
        vendor: filterVendor,
      })

      const response = await fetch(`/api/admin/products/export?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to export products')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `products-export-${new Date().toISOString().substring(0, 10)}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting products:', error)
      alert('Failed to export products')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div
        className="flex justify-between items-center mb-8"
        style={{ minWidth: '280px', width: '100%' }}
      >
        <div>
          <h1
            className="text-3xl font-serif font-bold"
            style={{
              color: '#2C2C2C',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal'
            }}
          >
            Products
          </h1>
          <p
            className="mt-2"
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            Manage your product catalog
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={loading || exporting}
            className="flex items-center gap-2 px-4 py-3 text-white rounded-md font-medium transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              minWidth: '130px',
              cursor: loading || exporting ? 'not-allowed' : 'pointer',
            }}
          >
            <Download size={18} />
            <span style={{ whiteSpace: 'nowrap' }}>{exporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
          <button
            onClick={() => router.push('/admin/products/new')}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-md font-medium transition-all"
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #a02865 0%, #6d0a3c 100%)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
            }}
          >
            <Plus size={20} />
            <span style={{ whiteSpace: 'nowrap' }}>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="bg-white rounded-lg shadow-sm p-6 mb-6"
        style={{ minWidth: '280px', width: '100%' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Product name or SKU..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#d1d5db',
                  minWidth: '100%'
                }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Category
            </label>
            <select
              id="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Brand
            </label>
            <select
              id="brand"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Stock Status
            </label>
            <select
              id="stock"
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Products</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Vendor Filter */}
          <div>
            <label
              htmlFor="vendor"
              className="block text-sm font-medium mb-2"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Vendor / Supplier
            </label>
            <input
              type="text"
              id="vendor"
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              placeholder="Search vendor..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        style={{ minWidth: '280px', width: '100%' }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p
              className="text-lg mb-4"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal'
              }}
            >
              No products found
            </p>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="px-6 py-3 text-white rounded-md font-medium"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
              }}
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '800px' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th
                    className="text-left px-6 py-4 text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Product
                  </th>
                  <th
                    className="text-left px-6 py-4 text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Brand
                  </th>
                  <th
                    className="text-left px-6 py-4 text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Category
                  </th>
                  <th
                    className="text-left px-6 py-4 text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Price
                  </th>
                  <th
                    className="text-left px-6 py-4 text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Status
                  </th>
                  <th
                    className="text-right px-6 py-4 text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="relative rounded overflow-hidden"
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#F5F5F5',
                            flexShrink: 0
                          }}
                        >
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].alt || product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ color: '#9CA3AF' }}>
                              No Image
                            </div>
                          )}
                        </div>
                        <div style={{ minWidth: '0', flex: '1' }}>
                          <p
                            className="font-medium"
                            style={{
                              color: '#2C2C2C',
                              display: 'block',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              overflowWrap: 'break-word'
                            }}
                          >
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {product.brand.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {product.salePrice ? (
                          <>
                            <p
                              className="font-medium"
                              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                            >
                              ${product.salePrice.toFixed(2)}
                            </p>
                            <p
                              className="text-sm line-through"
                              style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}
                            >
                              ${product.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p
                            className="font-medium"
                            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
                          >
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          backgroundColor: product.inStock ? '#D1FAE5' : '#FEE2E2',
                          color: product.inStock ? '#065F46' : '#991B1B',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="Edit product"
                        >
                          <Edit size={18} style={{ color: '#6B7280' }} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded hover:bg-red-50 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 size={18} style={{ color: '#DC2626' }} />
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

      {/* Products Count */}
      {!loading && products.length > 0 && (
        <div className="mt-4 text-center">
          <p
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal'
            }}
          >
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
