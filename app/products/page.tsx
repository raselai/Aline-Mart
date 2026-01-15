import { Suspense } from 'react'
import { Metadata } from 'next'
import ProductListingClient from './ProductListingClient'
import { supabase } from '@/lib/supabase'

// Force dynamic rendering for products page
export const dynamic = 'force-dynamic'

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
    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '20')
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Build query
    let query = supabase
      .from('Product')
      .select(`
        *,
        brand:Brand!Product_brandId_fkey (
          id,
          name,
          slug
        ),
        category:Category!Product_categoryId_fkey (
          id,
          name,
          slug
        ),
        images:ProductImage (
          id,
          url,
          alt,
          order
        ),
        variants:ProductVariant (
          id,
          color,
          size,
          stock
        )
      `, { count: 'exact' })
      .eq('inStock', true)

    // Apply search filter
    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
    }

    // Apply brand filter
    if (params.brand) {
      const { data: brandData } = await supabase
        .from('Brand')
        .select('id')
        .eq('slug', params.brand)
        .single()

      if (brandData) {
        query = query.eq('brandId', brandData.id)
      }
    }

    // Apply category filter
    if (params.category) {
      const { data: categoryData } = await supabase
        .from('Category')
        .select('id')
        .eq('slug', params.category)
        .single()

      if (categoryData) {
        query = query.eq('categoryId', categoryData.id)
      }
    }

    // Apply price filters
    if (params.minPrice) {
      query = query.gte('price', parseFloat(params.minPrice))
    }
    if (params.maxPrice) {
      query = query.lte('price', parseFloat(params.maxPrice))
    }

    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'name-asc':
          query = query.order('name', { ascending: true })
          break
        case 'name-desc':
          query = query.order('name', { ascending: false })
          break
        case 'newest':
          query = query.order('createdAt', { ascending: false })
          break
        default:
          query = query.order('createdAt', { ascending: false })
      }
    } else {
      query = query.order('createdAt', { ascending: false })
    }

    // Apply pagination
    query = query.range(from, to)

    const { data: products, error, count: totalCount } = await query

    if (error) throw error

    // Transform products to match expected format
    const transformedProducts = (products || []).map((product: any) => ({
      ...product,
      brand: Array.isArray(product.brand) ? product.brand[0] : product.brand,
      category: Array.isArray(product.category) ? product.category[0] : product.category,
      salePrice: product.salePrice || undefined,
      images: (product.images || [])
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((img: any) => ({
          url: img.url,
          alt: img.alt || undefined
        }))
    }))

    return {
      products: transformedProducts,
      total: totalCount || 0,
      page,
      limit,
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
    // Fetch all brands
    const { data: brands, error } = await supabase
      .from('Brand')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    // Get product counts for each brand
    const brandsWithCounts = await Promise.all(
      (brands || []).map(async (brand) => {
        const { count } = await supabase
          .from('Product')
          .select('*', { count: 'exact', head: true })
          .eq('brandId', brand.id)

        return {
          ...brand,
          _count: {
            products: count || 0
          }
        }
      })
    )

    return {
      brands: brandsWithCounts,
      count: brands?.length || 0
    }
  } catch (error) {
    console.error('Error fetching brands:', error)
    return { brands: [], count: 0 }
  }
}

async function fetchCategories() {
  try {
    // Fetch all categories
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count } = await supabase
          .from('Product')
          .select('*', { count: 'exact', head: true })
          .eq('categoryId', category.id)

        return {
          ...category,
          _count: {
            products: count || 0
          }
        }
      })
    )

    return {
      categories: categoriesWithCounts,
      count: categories?.length || 0
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
    <div className="min-h-screen bg-white pt-24 lg:pt-32">
      {/* Page Header */}
      <div className="bg-burgundy">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Luxury Collection
          </h1>
          <div className="text-lg text-white/90">
            <p>Discover our curated selection of premium products</p>
            <p>from the world's most prestigious brands.</p>
          </div>
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
