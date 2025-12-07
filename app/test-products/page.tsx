'use client'

import { useState, useEffect } from 'react'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters, { FilterOptions, ActiveFilters } from '@/components/products/ProductFilters'
import ProductSorter, { SortOption } from '@/components/products/ProductSorter'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TestProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [showFilters, setShowFilters] = useState(false)

  // Filter options (this would normally come from API)
  const [filterOptions] = useState<FilterOptions>({
    categories: [
      { id: '1', name: 'Men', count: 12 },
      { id: '2', name: 'Women', count: 15 },
      { id: '3', name: 'Watches', count: 8 },
      { id: '4', name: 'Bags', count: 10 },
      { id: '5', name: 'Shoes', count: 7 },
    ],
    brands: [
      { id: '1', name: 'Rolex', count: 5 },
      { id: '2', name: 'Gucci', count: 8 },
      { id: '3', name: 'Prada', count: 6 },
      { id: '4', name: 'Louis Vuitton', count: 7 },
      { id: '5', name: 'Hermès', count: 4 },
      { id: '6', name: 'Chanel', count: 5 },
    ],
    priceRange: { min: 0, max: 50000 },
    colors: ['Black', 'White', 'Red', 'Blue', 'Navy', 'Brown', 'Beige'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '40mm', '42mm']
  })

  // Active filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 50000 },
    colors: [],
    sizes: []
  })

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Build query params
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
        })

        // Add sort params
        if (sortBy === 'price-asc') {
          params.append('sortBy', 'price')
          params.append('sortOrder', 'asc')
        } else if (sortBy === 'price-desc') {
          params.append('sortBy', 'price')
          params.append('sortOrder', 'desc')
        } else if (sortBy === 'newest') {
          params.append('sortBy', 'createdAt')
          params.append('sortOrder', 'desc')
        } else if (sortBy === 'name-asc') {
          params.append('sortBy', 'name')
          params.append('sortOrder', 'asc')
        } else if (sortBy === 'name-desc') {
          params.append('sortBy', 'name')
          params.append('sortOrder', 'desc')
        }

        // Add price range
        if (activeFilters.priceRange.min > 0) {
          params.append('minPrice', activeFilters.priceRange.min.toString())
        }
        if (activeFilters.priceRange.max < 50000) {
          params.append('maxPrice', activeFilters.priceRange.max.toString())
        }

        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json()

        if (data.products) {
          setProducts(data.products)
          setTotalCount(data.total || data.products.length)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, sortBy, activeFilters])

  // Handle filter changes
  const handleFilterChange = (newFilters: ActiveFilters) => {
    setActiveFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 50000 },
      colors: [],
      sizes: []
    })
    setCurrentPage(1)
  }

  // Load more products
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1)
  }

  const hasMore = products.length < totalCount

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-2">
            Product Components Test
          </h1>
          <p className="text-text-secondary">
            Testing ProductCard, ProductGrid, ProductFilters, and ProductSorter components
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-4 right-4 z-30">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="gradient-primary shadow-lg"
              size="lg"
            >
              {showFilters ? <X className="w-5 h-5" /> : 'Filters'}
            </Button>
          </div>

          {/* Sidebar - Filters */}
          <aside
            className={`
              lg:block lg:w-64 lg:flex-shrink-0
              ${showFilters ? 'fixed inset-0 z-40 bg-white overflow-y-auto p-6' : 'hidden'}
            `}
          >
            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden absolute top-4 right-4 p-2 hover:bg-light-gray rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <ProductFilters
              options={filterOptions}
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Sorter */}
            <div className="mb-6">
              <ProductSorter
                value={sortBy}
                onChange={setSortBy}
                resultCount={totalCount}
              />
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </main>
        </div>
      </div>

      {/* Test Info Footer */}
      <div className="border-t border-gray-200 bg-light-gray mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="font-serif text-xl font-bold text-charcoal mb-4">
            Component Testing Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-charcoal mb-2">ProductCard Features:</h3>
              <ul className="space-y-1 text-text-secondary list-disc list-inside">
                <li>Magazine-style variable heights (small/medium/large)</li>
                <li>Image hover effect with zoom + secondary image</li>
                <li>Wishlist heart button (toggleable)</li>
                <li>Quick view button (eye icon)</li>
                <li>Add to Cart button (appears on hover)</li>
                <li>"New" and "Sale" badges with gradients</li>
                <li>Price formatting with sale price strikethrough</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">ProductGrid Features:</h3>
              <ul className="space-y-1 text-text-secondary list-disc list-inside">
                <li>Responsive: 3 columns desktop, 2 tablet, 1 mobile</li>
                <li>Variable heights for editorial layout</li>
                <li>"Load More" button for pagination</li>
                <li>Empty state with icon</li>
                <li>Skeleton loading screens</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">ProductFilters Features:</h3>
              <ul className="space-y-1 text-text-secondary list-disc list-inside">
                <li>Category checkboxes with counts</li>
                <li>Brand search and checkboxes</li>
                <li>Price range min/max inputs</li>
                <li>Color swatches (clickable circles)</li>
                <li>Size buttons (clickable chips)</li>
                <li>Active filter chips (removable)</li>
                <li>Clear all filters button</li>
                <li>Collapsible sections</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-2">ProductSorter Features:</h3>
              <ul className="space-y-1 text-text-secondary list-disc list-inside">
                <li>Dropdown with 6 sort options</li>
                <li>Featured, Newest, Price (asc/desc), Name (A-Z/Z-A)</li>
                <li>Result count display</li>
                <li>Check mark on selected option</li>
                <li>Descriptions for each option</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
