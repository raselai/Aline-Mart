import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'

/**
 * GET /api/admin/products/[id]
 * Get a single product by ID with all details
 * Requires admin authentication
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params

    // Fetch product with all relations
    const { data: product, error } = await supabase
      .from('Product')
      .select(`
        *,
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
          stock,
          priceModifier
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Sort images by order
    const productWithSortedImages = {
      ...product,
      images: product.images?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) || []
    }

    return NextResponse.json({ product: productWithSortedImages })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/products/[id]
 * Update an existing product
 * Requires admin authentication
 */
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params

    // Parse request body
    const body = await request.json()
    const {
      name,
      slug,
      description,
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
      images,
      variants
    } = body

    // Update product basic info
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null
    if (costPrice !== undefined) updateData.costPrice = costPrice ? parseFloat(costPrice) : null
    if (discountType !== undefined) updateData.discountType = discountType || null
    if (discountValue !== undefined) updateData.discountValue = discountValue ? parseFloat(discountValue) : null
    if (brandId !== undefined) updateData.brandId = brandId
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (inStock !== undefined) updateData.inStock = inStock
    if (featured !== undefined) updateData.featured = featured
    if (isNew !== undefined) updateData.isNew = isNew

    const { data: product, error: productError } = await supabase
      .from('Product')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (productError) {
      console.error('Error updating product:', productError)
      throw productError
    }

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      const { error: deleteError } = await supabase
        .from('ProductImage')
        .delete()
        .eq('productId', id)

      if (deleteError) {
        console.error('Error deleting existing images:', deleteError)
        // Continue anyway - we want to try inserting new images
      }

      // Insert new images
      if (images.length > 0) {
        const imageInserts = images.map((img: any, index: number) => ({
          id: img.id || `img_${id}_${index}_${Date.now()}`, // Generate unique ID if not provided
          productId: id,
          url: img.url,
          alt: img.alt || name,
          order: img.order !== undefined ? img.order : index
        }))

        const { error: insertError } = await supabase
          .from('ProductImage')
          .insert(imageInserts)

        if (insertError) {
          console.error('Error inserting images:', insertError)
          throw new Error(`Failed to save product images: ${insertError.message}`)
        }
      }
    }

    // Update variants if provided
    if (variants !== undefined) {
      // Delete existing variants
      const { error: deleteVariantError } = await supabase
        .from('ProductVariant')
        .delete()
        .eq('productId', id)

      if (deleteVariantError) {
        console.error('Error deleting existing variants:', deleteVariantError)
        // Continue anyway - we want to try inserting new variants
      }

      // Insert new variants
      if (variants.length > 0) {
        const variantInserts = variants.map((variant: any, index: number) => ({
          id: variant.id || variant.sku || `var_${id}_${index}_${Date.now()}`, // Use existing ID, SKU, or generate unique ID
          productId: id,
          color: variant.color || null,
          size: variant.size || null,
          sku: variant.sku,
          stock: variant.stock || 0,
          priceModifier: variant.priceModifier || 0
        }))

        const { error: insertVariantError } = await supabase
          .from('ProductVariant')
          .insert(variantInserts)

        if (insertVariantError) {
          console.error('Error inserting variants:', insertVariantError)
          throw new Error(`Failed to save product variants: ${insertVariantError.message}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/products/[id]
 * Delete a product (cascades to images and variants)
 * Requires admin authentication
 */
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params

    // Delete product images first
    await supabase
      .from('ProductImage')
      .delete()
      .eq('productId', id)

    // Delete product variants
    await supabase
      .from('ProductVariant')
      .delete()
      .eq('productId', id)

    // Delete the product
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
