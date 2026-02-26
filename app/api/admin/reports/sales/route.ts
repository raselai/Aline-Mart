import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'

export interface SalesReportItem {
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

export interface SalesReportResponse {
  data: SalesReportItem[]
  summary: {
    totalOrders: number
    totalItems: number
    totalRevenue: number
    totalCost: number | null
    totalProfit: number | null
    avgOrderValue: number
  }
  filters: {
    dateFrom: string | null
    dateTo: string | null
    vendor: string | null
    categoryId: string | null
    brandId: string | null
    status: string | null
  }
}

/**
 * GET /api/admin/reports/sales
 * Get sales report data with filters
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Verify admin session
    const admin = await requireModuleAccess('reports')

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const vendor = searchParams.get('vendor')
    const categoryId = searchParams.get('categoryId')
    const brandId = searchParams.get('brandId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '100')

    // First, fetch orders with date filter
    let ordersQuery = supabase
      .from('Order')
      .select('id, orderNumber, createdAt, status')

    // Apply date filters
    if (dateFrom) {
      ordersQuery = ordersQuery.gte('createdAt', dateFrom)
    }
    if (dateTo) {
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)
      ordersQuery = ordersQuery.lt('createdAt', endDate.toISOString())
    }
    if (status) {
      ordersQuery = ordersQuery.eq('status', status)
    }

    const { data: orders, error: ordersError } = await ordersQuery

    if (ordersError) {
      console.error('Orders fetch error:', ordersError)
      throw ordersError
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        data: [],
        summary: {
          totalOrders: 0,
          totalItems: 0,
          totalRevenue: 0,
          totalCost: null,
          totalProfit: null,
          avgOrderValue: 0
        },
        filters: { dateFrom, dateTo, vendor, categoryId, brandId, status }
      })
    }

    const orderIds = orders.map(o => o.id)
    const orderMap = new Map(orders.map(o => [o.id, o]))

    // Fetch order items with product details
    let itemsQuery = supabase
      .from('OrderItem')
      .select(`
        id,
        orderId,
        productId,
        productName,
        brandName,
        quantity,
        price,
        total
      `)
      .in('orderId', orderIds)

    const { data: orderItems, error: itemsError } = await itemsQuery

    if (itemsError) {
      console.error('Order items fetch error:', itemsError)
      throw itemsError
    }

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({
        data: [],
        summary: {
          totalOrders: orders.length,
          totalItems: 0,
          totalRevenue: 0,
          totalCost: null,
          totalProfit: null,
          avgOrderValue: 0
        },
        filters: { dateFrom, dateTo, vendor, categoryId, brandId, status }
      })
    }

    // Get unique product IDs
    const productIds = [...new Set(orderItems.map(item => item.productId))]

    // Fetch product details with category and brand
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select(`
        id,
        name,
        vendor,
        price,
        salePrice,
        costPrice,
        categoryId,
        brandId,
        Category:categoryId (
          id,
          name,
          parentId,
          Parent:parentId (
            id,
            name
          )
        ),
        Brand:brandId (
          id,
          name
        )
      `)
      .in('id', productIds)

    if (productsError) {
      console.error('Products fetch error:', productsError)
      throw productsError
    }

    const productMap = new Map(products?.map(p => [p.id, p]) || [])

    // Build report data
    let reportData: SalesReportItem[] = orderItems.map(item => {
      const order = orderMap.get(item.orderId)
      const product = productMap.get(item.productId)
      const category = product?.Category as any
      const brand = product?.Brand as any

      // Determine category hierarchy
      let categoryName = category?.name || 'Unknown'
      let subCategoryName: string | null = null

      // If category has a parent, it's a subcategory
      if (category?.parentId && category?.Parent) {
        subCategoryName = category.name
        categoryName = category.Parent.name
      }

      const regularPrice = product?.price || item.price
      const sellingPrice = item.price
      const costPrice = product?.costPrice || null
      const profit = costPrice !== null ? (sellingPrice - costPrice) * item.quantity : null

      return {
        id: item.id,
        orderId: item.orderId,
        orderNumber: order?.orderNumber || 'Unknown',
        orderDate: order?.createdAt || '',
        orderStatus: order?.status || 'Unknown',
        productId: item.productId,
        productName: item.productName,
        vendor: product?.vendor || null,
        categoryId: product?.categoryId || '',
        categoryName,
        subCategoryName,
        brandId: product?.brandId || '',
        brandName: item.brandName || brand?.name || 'Unknown',
        regularPrice,
        sellingPrice,
        costPrice,
        quantity: item.quantity,
        totalAmount: item.total,
        profit
      }
    })

    // Apply additional filters
    if (vendor) {
      reportData = reportData.filter(item =>
        item.vendor?.toLowerCase().includes(vendor.toLowerCase())
      )
    }
    if (categoryId) {
      reportData = reportData.filter(item => item.categoryId === categoryId)
    }
    if (brandId) {
      reportData = reportData.filter(item => item.brandId === brandId)
    }

    // Calculate summary
    const uniqueOrderIds = new Set(reportData.map(item => item.orderId))
    const totalRevenue = reportData.reduce((sum, item) => sum + item.totalAmount, 0)
    const totalCost = reportData.every(item => item.costPrice !== null)
      ? reportData.reduce((sum, item) => sum + (item.costPrice! * item.quantity), 0)
      : null
    const totalProfit = totalCost !== null ? totalRevenue - totalCost : null

    const summary = {
      totalOrders: uniqueOrderIds.size,
      totalItems: reportData.reduce((sum, item) => sum + item.quantity, 0),
      totalRevenue,
      totalCost,
      totalProfit,
      avgOrderValue: uniqueOrderIds.size > 0 ? totalRevenue / uniqueOrderIds.size : 0
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const paginatedData = reportData.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      data: paginatedData,
      total: reportData.length,
      page,
      limit,
      summary,
      filters: { dateFrom, dateTo, vendor, categoryId, brandId, status }
    })

  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error generating sales report:', error)
    return NextResponse.json(
      { error: 'Failed to generate sales report' },
      { status: 500 }
    )
  }
}
