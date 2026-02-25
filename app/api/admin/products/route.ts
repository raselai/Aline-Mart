import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import {
  buildVariantSku,
  normalizeVariantText,
  validateVariants,
  type EditableVariant,
} from '@/lib/variant-utils'

function sanitizeVariants(variants: unknown[] | undefined, slug: string): EditableVariant[] {
  if (!Array.isArray(variants)) return []

  return variants.map((variant, index) => {
    const variantData = (variant && typeof variant === 'object') ? (variant as Record<string, unknown>) : {}
    const color = normalizeVariantText(typeof variantData.color === 'string' ? variantData.color : null)
    const size = normalizeVariantText(typeof variantData.size === 'string' ? variantData.size : null)
    const fallbackSku = buildVariantSku(slug, color, size, index)
    const skuValue = typeof variantData.sku === 'string' ? variantData.sku : ''
    const sku = skuValue.trim() || fallbackSku
    const stockValue = Number(variantData.stock)
    const stock = Number.isFinite(stockValue) ? Math.max(0, stockValue) : 0
    const priceModifierValue = Number(variantData.priceModifier)
    const priceModifier = Number.isFinite(priceModifierValue)
      ? priceModifierValue
      : 0

    return {
      id: typeof variantData.id === 'string' ? variantData.id : undefined,
      color,
      size,
      sku,
      stock,
      priceModifier,
    }
  })
}

/**
 * GET /api/admin/products
 * List all products with filtering and sorting
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Verify admin session
    const admin = await requireModuleAccess('products')

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const brand = searchParams.get('brand') || ''
    const category = searchParams.get('category') || ''
    const stock = searchParams.get('stock') || ''
    const vendor = searchParams.get('vendor') || ''
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('Product')
      .select(`
        id,
        name,
        slug,
        description,
        price,
        salePrice,
        inStock,
        featured,
        isNew,
        createdAt,
        updatedAt,
        brand:Brand!Product_brandId_fkey (
          id,
          name,
          slug,
          logo
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
          sku,
          stock
        )
      `, { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply category filter - need to get categoryId first
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

    // Apply brand filter - need to get brandId first
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

    // Apply stock filter
    if (stock === 'in-stock') {
      query = query.eq('inStock', true)
    } else if (stock === 'out-of-stock') {
      query = query.eq('inStock', false)
    }

    // Apply vendor filter
    if (vendor) {
      query = query.ilike('vendor', `%${vendor}%`)
    }

    // Apply sorting
    const ascending = order === 'asc'
    if (sort === 'name') {
      query = query.order('name', { ascending })
    } else if (sort === 'price') {
      query = query.order('price', { ascending })
    } else {
      query = query.order('createdAt', { ascending })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute the built query with filters
    const { data: products, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Sort images by order
    const productsWithSortedImages = products?.map(product => ({
      ...product,
      images: product.images?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) || []
    })) || []

    return NextResponse.json({
      products: productsWithSortedImages,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/products
 * Create a new product
 * Requires admin authentication
 */
export async function POST(request: Request) {
  try {
    // Verify admin session
    const admin = await requireModuleAccess('products')

    // Parse request body
    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      salePrice,
      costPrice,
      discountType,
      discountValue,
      brandId,
      categoryId,
      inStock,
      featured,
      isNew,
      weight,
      dimensions,
      shippingFeeInsideDhaka,
      shippingFeeOutsideDhaka,
      warranty,
      vendor,
      status,
      stock,
      images,
      variants
    } = body

    console.log('📝 Received product data:', {
      name,
      slug,
      brandId,
      categoryId,
      price,
      imagesCount: images?.length,
      variantsCount: variants?.length
    })

    // Validate required fields
    if (!name || !slug || !price || !brandId || !categoryId) {
      console.error('❌ Missing required fields:', { name, slug, price, brandId, categoryId })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const normalizedVariants = sanitizeVariants(variants, slug)
    const variantValidationErrors = validateVariants(normalizedVariants)
    if (variantValidationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Invalid variant data',
          code: 'INVALID_VARIANTS',
          variantErrors: variantValidationErrors,
        },
        { status: 400 }
      )
    }

    // Generate product ID from slug (format: prod_slug)
    const productId = `prod_${slug}`

    // Create product
    const productData = {
      id: productId,
      name,
      slug,
      description: description || '',
      shortDescription: shortDescription || null,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      costPrice: costPrice !== undefined && costPrice !== null && costPrice !== '' ? parseFloat(costPrice) : null,
      discountType: discountType || null,
      discountValue: discountValue !== undefined && discountValue !== null && discountValue !== '' ? parseFloat(discountValue) : null,
      brandId,
      categoryId,
      inStock: inStock !== false,
      featured: featured === true,
      isNew: isNew === true,
      weight: weight ? String(weight) : null,
      dimensions: dimensions ? String(dimensions) : null,
      shippingFeeInsideDhaka: shippingFeeInsideDhaka !== undefined && shippingFeeInsideDhaka !== null && shippingFeeInsideDhaka !== '' ? parseFloat(shippingFeeInsideDhaka) : null,
      shippingFeeOutsideDhaka: shippingFeeOutsideDhaka !== undefined && shippingFeeOutsideDhaka !== null && shippingFeeOutsideDhaka !== '' ? parseFloat(shippingFeeOutsideDhaka) : null,
      warranty: warranty ? String(warranty) : null,
      vendor: vendor ? String(vendor) : null,
      status: status === 'DRAFT' ? 'DRAFT' : 'ACTIVE',
      stock: stock !== undefined && stock !== null ? parseInt(stock) || 0 : 0,
    }

    console.log('💾 Inserting product:', productData)

    const { data: product, error: productError } = await supabase
      .from('Product')
      .insert(productData)
      .select()
      .single()

    if (productError) {
      console.error('❌ Database error creating product:', productError)
      console.error('Error details:', JSON.stringify(productError, null, 2))
      throw productError
    }

    console.log('✅ Product created:', product.id)

    // Add product images
    if (images && images.length > 0) {
      const imageInserts = images.map((img: any, index: number) => ({
        id: `img_${productId}_${index}`, // Generate image ID
        productId: product.id,
        url: img.url,
        alt: img.alt || name,
        order: img.order !== undefined ? img.order : index
      }))

      console.log('📸 Inserting images:', imageInserts.length)

      const { error: imagesError } = await supabase
        .from('ProductImage')
        .insert(imageInserts)

      if (imagesError) {
        console.error('❌ Error adding product images:', imagesError)
        throw new Error(`Failed to save product images: ${imagesError.message}`)
      } else {
        console.log('✅ Images added successfully')
      }
    }

    // Add product variants
    if (normalizedVariants.length > 0) {
      const variantInserts = normalizedVariants.map((variant: EditableVariant, index: number) => ({
        id: variant.sku || `var_${productId}_${index}`, // Use SKU as ID or generate one
        productId: product.id,
        color: variant.color || null,
        size: variant.size || null,
        sku: variant.sku,
        stock: variant.stock ?? 0,
        priceModifier: variant.priceModifier ?? 0
      }))

      console.log('🎨 Inserting variants:', variantInserts.length)

      const { error: variantsError } = await supabase
        .from('ProductVariant')
        .insert(variantInserts)

      if (variantsError) {
        console.error('❌ Error adding product variants:', variantsError)
        throw new Error(`Failed to save product variants: ${variantsError.message}`)
      } else {
        console.log('✅ Variants added successfully')
      }
    }

    return NextResponse.json({
      success: true,
      product,
      message: 'Product created successfully'
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
