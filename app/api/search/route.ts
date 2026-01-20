import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')

    // Return empty results if no query
    if (!query.trim()) {
      return NextResponse.json({
        products: [],
        total: 0,
        page,
        limit,
        query: ''
      })
    }

    // Calculate pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Build the query
    let queryBuilder = supabase
      .from('Product')
      .select(`
        id,
        name,
        slug,
        description,
        price,
        salePrice,
        inStock,
        isNew,
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
        )
      `, { count: 'exact' })

    // Full-text search across name, description, and brand name
    // Using ilike for case-insensitive pattern matching
    const searchTerm = `%${query}%`

    // Search in product name or description
    queryBuilder = queryBuilder.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)

    // Filter by category if provided
    if (category) {
      queryBuilder = queryBuilder.eq('categoryId', category)
    }

    // Filter by brand if provided
    if (brand) {
      queryBuilder = queryBuilder.eq('brandId', brand)
    }

    // Only show in-stock products
    queryBuilder = queryBuilder.eq('inStock', true)
    queryBuilder = queryBuilder.or('status.is.null,status.eq.ACTIVE')

    // Order by relevance (products with query in name first, then by newest)
    queryBuilder = queryBuilder.order('createdAt', { ascending: false })

    // Apply pagination
    queryBuilder = queryBuilder.range(from, to)

    const { data: products, error, count } = await queryBuilder

    if (error) {
      console.error('Search error:', error)
      throw error
    }

    // Sort products by images and transform brand/category from arrays to objects
    const sortedProducts = (products || []).map((product: any) => ({
      ...product,
      brand: Array.isArray(product.brand) ? product.brand[0] : product.brand,
      category: Array.isArray(product.category) ? product.category[0] : product.category,
      salePrice: product.salePrice || undefined,
      images: (product.images || [])
        .sort((a: any, b: any) => a.order - b.order)
        .map((img: any) => ({
          url: img.url,
          alt: img.alt || undefined
        }))
    }))

    return NextResponse.json({
      products: sortedProducts,
      total: count || 0,
      page,
      limit,
      query
    })

  } catch (error) {
    console.error('Error in search API:', error)
    return NextResponse.json(
      {
        error: 'Failed to search products',
        products: [],
        total: 0
      },
      { status: 500 }
    )
  }
}
