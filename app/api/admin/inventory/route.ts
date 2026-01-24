import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import type { InventoryFilters, InventoryListResponse, StockStatus } from '@/types/inventory'

/**
 * GET /api/admin/inventory
 * List all product variants with stock information
 * Supports filtering, sorting, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const filters: InventoryFilters = {
      search: searchParams.get('search') || undefined,
      stockStatus: (searchParams.get('stockStatus') as StockStatus) || undefined,
      brandId: searchParams.get('brandId') || undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') as InventoryFilters['sortBy']) || 'stock',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
    }

    // Build base query
    let query = supabase
      .from('ProductVariant')
      .select(`
        id,
        sku,
        color,
        size,
        stock,
        lowStockThreshold,
        productId,
        Product:productId (
          id,
          name,
          slug,
          brandId,
          categoryId,
          ProductImage (
            url,
            order
          ),
          Brand:brandId (
            id,
            name,
            slug
          ),
          Category:categoryId (
            id,
            name,
            slug
          )
        )
      `, { count: 'exact' })

    // Apply search filter - search by SKU or product name
    if (filters.search) {
      // For search, we need to use a different approach
      // First get products matching the search
      const { data: matchingProducts } = await supabase
        .from('Product')
        .select('id')
        .ilike('name', `%${filters.search}%`)

      const productIds = matchingProducts?.map(p => p.id) || []

      // Search by SKU or product IDs
      if (productIds.length > 0) {
        query = query.or(`sku.ilike.%${filters.search}%,productId.in.(${productIds.join(',')})`)
      } else {
        query = query.ilike('sku', `%${filters.search}%`)
      }
    }

    // Apply brand filter
    if (filters.brandId) {
      const { data: brandProducts } = await supabase
        .from('Product')
        .select('id')
        .eq('brandId', filters.brandId)

      const productIds = brandProducts?.map(p => p.id) || []
      if (productIds.length > 0) {
        query = query.in('productId', productIds)
      } else {
        // No products for this brand
        return NextResponse.json({
          variants: [],
          total: 0,
          page: filters.page,
          limit: filters.limit,
          stats: { totalVariants: 0, totalInStock: 0, totalLowStock: 0, totalOutOfStock: 0 }
        })
      }
    }

    // Apply category filter
    if (filters.categoryId) {
      const { data: categoryProducts } = await supabase
        .from('Product')
        .select('id')
        .eq('categoryId', filters.categoryId)

      const productIds = categoryProducts?.map(p => p.id) || []
      if (productIds.length > 0) {
        query = query.in('productId', productIds)
      } else {
        return NextResponse.json({
          variants: [],
          total: 0,
          page: filters.page,
          limit: filters.limit,
          stats: { totalVariants: 0, totalInStock: 0, totalLowStock: 0, totalOutOfStock: 0 }
        })
      }
    }

    // Apply stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      switch (filters.stockStatus) {
        case 'out_of_stock':
          query = query.eq('stock', 0)
          break
        case 'low_stock':
          // Low stock: stock > 0 AND stock <= lowStockThreshold
          // Since lowStockThreshold might not be set, we use a default
          query = query.gt('stock', 0).lte('stock', 10)
          break
        case 'in_stock':
          query = query.gt('stock', 10)
          break
      }
    }

    // Apply sorting
    const sortColumn = filters.sortBy === 'name' ? 'productId' : filters.sortBy === 'sku' ? 'sku' : 'stock'
    query = query.order(sortColumn, { ascending: filters.sortOrder === 'asc' })

    // Apply pagination
    const page = filters.page || 1
    const limit = filters.limit || 20
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: variants, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Get stats for all variants (not just current page)
    const { data: allVariants } = await supabase
      .from('ProductVariant')
      .select('stock, lowStockThreshold')

    const stats = {
      totalVariants: allVariants?.length || 0,
      totalInStock: 0,
      totalLowStock: 0,
      totalOutOfStock: 0
    }

    if (allVariants) {
      for (const v of allVariants) {
        const threshold = v.lowStockThreshold || 10
        if (v.stock === 0) {
          stats.totalOutOfStock++
        } else if (v.stock <= threshold) {
          stats.totalLowStock++
        } else {
          stats.totalInStock++
        }
      }
    }

    // Transform data
    const transformedVariants = (variants || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,
      color: v.color,
      size: v.size,
      stock: v.stock,
      lowStockThreshold: v.lowStockThreshold || 10,
      productId: v.productId,
      product: {
        id: v.Product?.id || '',
        name: v.Product?.name || 'Unknown',
        slug: v.Product?.slug || '',
        images: (v.Product?.ProductImage || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
        brand: {
          id: v.Product?.Brand?.id || '',
          name: v.Product?.Brand?.name || 'Unknown',
          slug: v.Product?.Brand?.slug || ''
        },
        category: {
          id: v.Product?.Category?.id || '',
          name: v.Product?.Category?.name || 'Unknown',
          slug: v.Product?.Category?.slug || ''
        }
      }
    }))

    const response: InventoryListResponse = {
      variants: transformedVariants,
      total: count || 0,
      page,
      limit,
      stats
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}
