import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/products
 * List all products with filtering and sorting
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const brand = searchParams.get('brand') || ''
    const category = searchParams.get('category') || ''
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
      `)

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply brand filter
    if (brand) {
      query = query.eq('brand.slug', brand)
    }

    // Apply category filter
    if (category) {
      query = query.eq('category.slug', category)
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

    // Execute query
    const { data: products, error, count } = await supabase
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
      .order('createdAt', { ascending: false })

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
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      brandId,
      categoryId,
      inStock,
      featured,
      isNew,
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

    // Generate product ID from slug (format: prod_slug)
    const productId = `prod_${slug}`

    // Create product
    const productData = {
      id: productId,
      name,
      slug,
      description: description || '',
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      brandId,
      categoryId,
      inStock: inStock !== false,
      featured: featured === true,
      isNew: isNew === true,
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
      } else {
        console.log('✅ Images added successfully')
      }
    }

    // Add product variants
    if (variants && variants.length > 0) {
      const variantInserts = variants.map((variant: any, index: number) => ({
        id: variant.sku || `var_${productId}_${index}`, // Use SKU as ID or generate one
        productId: product.id,
        color: variant.color || null,
        size: variant.size || null,
        sku: variant.sku,
        stock: variant.stock || 0,
        priceModifier: variant.priceModifier || 0
      }))

      console.log('🎨 Inserting variants:', variantInserts.length)

      const { error: variantsError } = await supabase
        .from('ProductVariant')
        .insert(variantInserts)

      if (variantsError) {
        console.error('❌ Error adding product variants:', variantsError)
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
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
