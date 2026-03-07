'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductGrid, ProductFilters, ProductSorter } from '@/components/products'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SlidersHorizontal, X } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  salePrice?: number
  inStock: boolean
  featured: boolean
  brandId: string
  categoryId: string
  createdAt: string
  updatedAt: string
  brand: {
    id: string
    name: string
    slug: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  images: Array<{
    url: string
    alt?: string
  }>
  variants: Array<{
    id: string
    color?: string
    size?: string
    sku: string
    stock: number
  }>
}

interface Brand {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface Category {
  id: string
  name: string
  slug: string
  productCount?: number
}

interface ProductListingClientProps {
  initialProducts: Product[]
  initialTotal: number
  initialPage: number
  initialLimit: number
  brands: Brand[]
  categories: Category[]
  initialFilters: {
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    color?: string
    size?: string
    sort?: string
    search?: string
  }
}

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

const AVAILABLE_COLORS = [
  'Black',
  'White',
  'Brown',
  'Blue',
  'Red',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Gray',
  'Beige',
  'Navy',
]

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']

export default function ProductListingClient({
  initialProducts,
  initialTotal,
  initialPage,
  initialLimit,
  brands,
  categories,
  initialFilters,
}: ProductListingClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [total, setTotal] = useState(initialTotal)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.category ? initialFilters.category.split(',') : []
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialFilters.brand ? initialFilters.brand.split(',') : []
  )
  const [priceRange, setPriceRange] = useState({
    min: initialFilters.minPrice || '',
    max: initialFilters.maxPrice || '',
  })
  const [selectedColors, setSelectedColors] = useState<string[]>(
    initialFilters.color ? initialFilters.color.split(',') : []
  )
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters.size ? initialFilters.size.split(',') : []
  )
  const [sortBy, setSortBy] = useState<SortOption>((initialFilters.sort as SortOption) || 'featured')

  // Build URL with filters
  const buildUrl = useCallback(() => {
    const params = new URLSearchParams()

    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories.join(','))
    }
    if (selectedBrands.length > 0) {
      params.set('brand', selectedBrands.join(','))
    }
    if (priceRange.min) {
      params.set('minPrice', priceRange.min)
    }
    if (priceRange.max) {
      params.set('maxPrice', priceRange.max)
    }
    if (selectedColors.length > 0) {
      params.set('color', selectedColors.join(','))
    }
    if (selectedSizes.length > 0) {
      params.set('size', selectedSizes.join(','))
    }
    if (sortBy && sortBy !== 'featured') {
      params.set('sort', sortBy)
    }
    if (initialFilters.search) {
      params.set('search', initialFilters.search)
    }

    return `/products${params.toString() ? `?${params.toString()}` : ''}`
  }, [
    selectedCategories,
    selectedBrands,
    priceRange,
    selectedColors,
    selectedSizes,
    sortBy,
    initialFilters.search,
  ])

  // Update URL when filters change
  useEffect(() => {
    const url = buildUrl()
    router.push(url, { scroll: false })
  }, [buildUrl, router])

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      try {
        const params = new URLSearchParams()
        params.set('page', currentPage.toString())
        params.set('limit', initialLimit.toString())

        if (selectedCategories.length > 0) {
          params.set('category', selectedCategories.join(','))
        }
        if (selectedBrands.length > 0) {
          params.set('brand', selectedBrands.join(','))
        }
        if (priceRange.min) {
          params.set('minPrice', priceRange.min)
        }
        if (priceRange.max) {
          params.set('maxPrice', priceRange.max)
        }
        if (selectedColors.length > 0) {
          params.set('color', selectedColors.join(','))
        }
        if (selectedSizes.length > 0) {
          params.set('size', selectedSizes.join(','))
        }
        if (sortBy) {
          params.set('sort', sortBy)
        }
        if (initialFilters.search) {
          params.set('search', initialFilters.search)
        }

        const res = await fetch(`/api/products?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch products')

        const response = await res.json()
        setProducts(response.data || [])
        setTotal(response.pagination?.totalCount || 0)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [
    selectedCategories,
    selectedBrands,
    priceRange,
    selectedColors,
    selectedSizes,
    sortBy,
    currentPage,
    initialLimit,
    initialFilters.search,
  ])

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange({ min: '', max: '' })
    setSelectedColors([])
    setSelectedSizes([])
    setCurrentPage(1)
    setMobileFiltersOpen(false)
  }

  const handleRemoveFilter = (filterType: string, value: string) => {
    switch (filterType) {
      case 'category':
        setSelectedCategories((prev) => prev.filter((c) => c !== value))
        break
      case 'brand':
        setSelectedBrands((prev) => prev.filter((b) => b !== value))
        break
      case 'color':
        setSelectedColors((prev) => prev.filter((c) => c !== value))
        break
      case 'size':
        setSelectedSizes((prev) => prev.filter((s) => s !== value))
        break
      case 'price':
        setPriceRange({ min: '', max: '' })
        break
    }
    setCurrentPage(1)
  }

  const gridRef = useRef<HTMLDivElement>(null)

  const handleLoadMore = () => {
    if (isLoadingMore) return
    setCurrentPage((prev) => prev + 1)
    // Scroll to top of product grid after page change
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Calculate active filter count
  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedColors.length +
    selectedSizes.length +
    (priceRange.min || priceRange.max ? 1 : 0)

  // Build active filters array for chips
  const activeFilters = [
    ...selectedCategories.map((slug) => ({
      type: 'category',
      value: slug,
      label: categories.find((c) => c.slug === slug)?.name || slug,
    })),
    ...selectedBrands.map((slug) => ({
      type: 'brand',
      value: slug,
      label: brands.find((b) => b.slug === slug)?.name || slug,
    })),
    ...selectedColors.map((color) => ({
      type: 'color',
      value: color,
      label: color,
    })),
    ...selectedSizes.map((size) => ({
      type: 'size',
      value: size,
      label: size,
    })),
    ...(priceRange.min || priceRange.max
      ? [
          {
            type: 'price',
            value: 'price',
            label: `$${priceRange.min || '0'} - $${priceRange.max || '∞'}`,
          },
        ]
      : []),
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            options={{
              categories: categories.map((cat) => ({
                id: cat.slug,
                name: cat.name,
                count: cat.productCount,
              })),
              brands: brands.map((brand) => ({
                id: brand.slug,
                name: brand.name,
                count: brand.productCount,
              })),
              colors: AVAILABLE_COLORS,
              sizes: AVAILABLE_SIZES,
            }}
            activeFilters={{
              categories: selectedCategories,
              brands: selectedBrands,
              colors: selectedColors,
              sizes: selectedSizes,
              priceRange: {
                min: priceRange.min ? parseFloat(priceRange.min) : 0,
                max: priceRange.max ? parseFloat(priceRange.max) : 0,
              },
            }}
            onFilterChange={(filters) => {
              setSelectedCategories(filters.categories)
              setSelectedBrands(filters.brands)
              setSelectedColors(filters.colors)
              setSelectedSizes(filters.sizes)
              setPriceRange({
                min: filters.priceRange.min ? filters.priceRange.min.toString() : '',
                max: filters.priceRange.max ? filters.priceRange.max.toString() : '',
              })
              setCurrentPage(1)
            }}
            onClearAll={handleClearFilters}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <span className="bg-burgundy text-white text-xs px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                <div className="mb-6">
                  <h2 className="text-xl font-serif font-bold text-charcoal">Filters</h2>
                </div>
                <ProductFilters
                  options={{
                    categories: categories.map((cat) => ({
                      id: cat.slug,
                      name: cat.name,
                      count: cat.productCount,
                    })),
                    brands: brands.map((brand) => ({
                      id: brand.slug,
                      name: brand.name,
                      count: brand.productCount,
                    })),
                    colors: AVAILABLE_COLORS,
                    sizes: AVAILABLE_SIZES,
                  }}
                  activeFilters={{
                    categories: selectedCategories,
                    brands: selectedBrands,
                    colors: selectedColors,
                    sizes: selectedSizes,
                    priceRange: {
                      min: priceRange.min ? parseFloat(priceRange.min) : 0,
                      max: priceRange.max ? parseFloat(priceRange.max) : 0,
                    },
                  }}
                  onFilterChange={(filters) => {
                    setSelectedCategories(filters.categories)
                    setSelectedBrands(filters.brands)
                    setSelectedColors(filters.colors)
                    setSelectedSizes(filters.sizes)
                    setPriceRange({
                      min: filters.priceRange.min ? filters.priceRange.min.toString() : '',
                      max: filters.priceRange.max ? filters.priceRange.max.toString() : '',
                    })
                    setCurrentPage(1)
                  }}
                  onClearAll={handleClearFilters}
                />
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-full gradient-primary text-white"
                  >
                    View {total} Products
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-secondary font-medium">Active Filters:</span>
              {activeFilters.map((filter, index) => (
                <button
                  key={`${filter.type}-${filter.value}-${index}`}
                  onClick={() => handleRemoveFilter(filter.type, filter.value)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-light-gray rounded-full text-sm text-charcoal hover:bg-gray-200 transition-colors"
                >
                  <span>{filter.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              {activeFilters.length > 1 && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-burgundy hover:underline font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          )}

          {/* Sorter and Result Count */}
          <div className="mb-8">
            <ProductSorter
              value={sortBy}
              onChange={setSortBy}
              resultCount={total}
            />
          </div>

          {/* Product Grid */}
          <div ref={gridRef}>
            <ProductGrid
              products={products}
              loading={isLoading}
              hasMore={products.length < total}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
