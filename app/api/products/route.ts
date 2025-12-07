import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const brandSlug = searchParams.get('brand') || ''
    const categorySlug = searchParams.get('category') || ''
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const featured = searchParams.get('featured') === 'true'
    const isNew = searchParams.get('new') === 'true'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc'

    // Calculate pagination
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

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (brandSlug) {
      // First get brand ID
      const { data: brandData } = await supabase
        .from('Brand')
        .select('id')
        .eq('slug', brandSlug)
        .single()

      if (brandData) {
        query = query.eq('brandId', brandData.id)
      }
    }

    if (categorySlug) {
      // First get category ID
      const { data: categoryData } = await supabase
        .from('Category')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (categoryData) {
        query = query.eq('categoryId', categoryData.id)
      }
    }

    if (minPrice > 0) {
      query = query.gte('price', minPrice)
    }

    if (maxPrice < 999999) {
      query = query.lte('price', maxPrice)
    }

    if (featured) {
      query = query.eq('featured', true)
    }

    if (isNew) {
      query = query.eq('isNew', true)
    }

    // Apply sorting
    if (sortBy === 'price') {
      query = query.order('price', { ascending: sortOrder })
    } else if (sortBy === 'name') {
      query = query.order('name', { ascending: sortOrder })
    } else {
      query = query.order('createdAt', { ascending: sortOrder })
    }

    // Apply pagination
    query = query.range(from, to)

    const { data: products, error, count: totalCount } = await query

    if (error) {
      throw error
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((totalCount || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    // Transform products to match ProductCard interface
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

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount: totalCount || 0,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      filters: {
        search,
        brandSlug,
        categorySlug,
        minPrice,
        maxPrice,
        featured,
        isNew,
        sortBy,
        sortOrder: sortOrder ? 'asc' : 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
