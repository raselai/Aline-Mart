import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'

function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) return ''
  const str = String(field)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function arrayToCsv(headers: string[], rows: Array<Record<string, string | number | null>>): string {
  const headerLine = headers.map(escapeCsvField).join(',')
  const dataLines = rows.map((row) => headers.map((header) => escapeCsvField(row[header])).join(','))
  return [headerLine, ...dataLines].join('\n')
}

export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const brand = searchParams.get('brand') || ''
    const category = searchParams.get('category') || ''
    const stock = searchParams.get('stock') || ''
    const vendor = searchParams.get('vendor') || ''
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    let query = supabase
      .from('Product')
      .select(`
        id,
        name,
        slug,
        price,
        salePrice,
        costPrice,
        inStock,
        stock,
        featured,
        isNew,
        vendor,
        status,
        createdAt,
        updatedAt,
        brand:Brand!Product_brandId_fkey (
          name
        ),
        category:Category!Product_categoryId_fkey (
          name
        ),
        variants:ProductVariant (
          color,
          size,
          sku,
          stock
        )
      `)

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      const { data: categoryData } = await supabase
        .from('Category')
        .select('id')
        .eq('slug', category)
        .single()

      if (categoryData) {
        query = query.eq('categoryId', categoryData.id)
      }
    }

    if (brand) {
      const { data: brandData } = await supabase
        .from('Brand')
        .select('id')
        .eq('slug', brand)
        .single()

      if (brandData) {
        query = query.eq('brandId', brandData.id)
      }
    }

    if (stock === 'in-stock') {
      query = query.eq('inStock', true)
    } else if (stock === 'out-of-stock') {
      query = query.eq('inStock', false)
    }

    if (vendor) {
      query = query.ilike('vendor', `%${vendor}%`)
    }

    const ascending = order === 'asc'
    if (sort === 'name') {
      query = query.order('name', { ascending })
    } else if (sort === 'price') {
      query = query.order('price', { ascending })
    } else {
      query = query.order('createdAt', { ascending })
    }

    const { data: products, error } = await query
    if (error) throw error

    const headers = [
      'productId',
      'productName',
      'slug',
      'brand',
      'category',
      'vendor',
      'status',
      'inStock',
      'baseStock',
      'price',
      'salePrice',
      'costPrice',
      'featured',
      'isNew',
      'variantColor',
      'variantSize',
      'variantSku',
      'variantStock',
      'createdAt',
      'updatedAt',
    ]

    const rows: Array<Record<string, string | number | null>> = []

    for (const product of products || []) {
      const brandInfo = Array.isArray(product.brand) ? product.brand[0] : product.brand
      const categoryInfo = Array.isArray(product.category) ? product.category[0] : product.category
      const variants = product.variants || []

      if (variants.length === 0) {
        rows.push({
          productId: product.id,
          productName: product.name,
          slug: product.slug,
          brand: brandInfo?.name || '',
          category: categoryInfo?.name || '',
          vendor: product.vendor || '',
          status: product.status || '',
          inStock: product.inStock ? 'Yes' : 'No',
          baseStock: Number(product.stock || 0),
          price: Number(product.price || 0),
          salePrice: product.salePrice !== null ? Number(product.salePrice) : '',
          costPrice: product.costPrice !== null ? Number(product.costPrice) : '',
          featured: product.featured ? 'Yes' : 'No',
          isNew: product.isNew ? 'Yes' : 'No',
          variantColor: '',
          variantSize: '',
          variantSku: '',
          variantStock: '',
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
        continue
      }

      for (const variant of variants) {
        rows.push({
          productId: product.id,
          productName: product.name,
          slug: product.slug,
          brand: brandInfo?.name || '',
          category: categoryInfo?.name || '',
          vendor: product.vendor || '',
          status: product.status || '',
          inStock: product.inStock ? 'Yes' : 'No',
          baseStock: Number(product.stock || 0),
          price: Number(product.price || 0),
          salePrice: product.salePrice !== null ? Number(product.salePrice) : '',
          costPrice: product.costPrice !== null ? Number(product.costPrice) : '',
          featured: product.featured ? 'Yes' : 'No',
          isNew: product.isNew ? 'Yes' : 'No',
          variantColor: variant.color || '',
          variantSize: variant.size || '',
          variantSku: variant.sku || '',
          variantStock: Number(variant.stock || 0),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })
      }
    }

    const csv = arrayToCsv(headers, rows)
    const dateTag = new Date().toISOString().substring(0, 10)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="products-export-${dateTag}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting products:', error)
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    )
  }
}
