import { Suspense } from 'react'
import { Metadata } from 'next'
import ProductListingClient from './ProductListingClient'

export const metadata: Metadata = {
  title: 'Luxury Products | Aline Mart',
  description: 'Shop the finest selection of luxury products from world-renowned brands. Discover watches, clothing, accessories, bags, and shoes from Rolex, Gucci, Prada, Louis Vuitton, Hermès, and more.',
  openGraph: {
    title: 'Luxury Products | Aline Mart',
    description: 'Shop the finest selection of luxury products from world-renowned brands.',
    type: 'website',
    images: [
      {
        url: '/og-image-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Aline Mart Luxury Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Products | Aline Mart',
    description: 'Shop the finest selection of luxury products from world-renowned brands.',
  },
}

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    color?: string
    size?: string
    sort?: string
    search?: string
  }>
}

async function fetchProducts(params: {
  page?: string
  limit?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  color?: string
  size?: string
  sort?: string
  search?: string
}) {
  try {
    // Build query params
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/products?${queryParams.toString()}`

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Always fetch fresh data
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!res.ok) {
      throw new Error('Failed to fetch products')
    }

    const response = await res.json()
    return {
      products: response.data || [],
      total: response.pagination?.totalCount || 0,
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 20,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      products: [],
      total: 0,
      page: 1,
      limit: 20,
    }
  }
}

async function fetchBrands() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/brands?includeProducts=true`

    const res = await fetch(apiUrl, {
      cache: 'force-cache', // Brands don't change often
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch brands')
    }

    const response = await res.json()
    return {
      brands: response.data || [],
      count: response.count || 0
    }
  } catch (error) {
    console.error('Error fetching brands:', error)
    return { brands: [], count: 0 }
  }
}

async function fetchCategories() {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories?includeProducts=true`

    const res = await fetch(apiUrl, {
      cache: 'force-cache', // Categories don't change often
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch categories')
    }

    const response = await res.json()
    return {
      categories: response.data?.all || [],
      count: response.count || 0
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { categories: [], count: 0 }
  }
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams

  // Fetch data in parallel
  const [productsData, brandsData, categoriesData] = await Promise.all([
    fetchProducts(searchParams),
    fetchBrands(),
    fetchCategories(),
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-secondary">
            <a href="/" className="hover:text-charcoal transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-charcoal font-medium">Products</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-200 bg-light-gray">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Luxury Collection
          </h1>
          <p className="text-lg text-secondary max-w-2xl">
            Discover our curated selection of premium products from the world's most prestigious brands.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<ProductListingSkeleton />}>
        <ProductListingClient
          initialProducts={productsData.products}
          initialTotal={productsData.total}
          initialPage={productsData.page}
          initialLimit={productsData.limit}
          brands={brandsData.brands}
          categories={categoriesData.categories}
          initialFilters={{
            category: searchParams.category,
            brand: searchParams.brand,
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice,
            color: searchParams.color,
            size: searchParams.size,
            sort: searchParams.sort,
            search: searchParams.search,
          }}
        />
      </Suspense>
    </div>
  )
}

function ProductListingSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          {/* Sorter Skeleton */}
          <div className="flex items-center justify-between mb-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-[3/4] mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
