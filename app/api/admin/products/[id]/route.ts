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
    const admin = await requireModuleAccess('products')

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
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
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
    const admin = await requireModuleAccess('products')

    const params = await props.params
    const { id } = params

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

    if (variants !== undefined) {
      const normalizedVariants = sanitizeVariants(variants, slug || id)
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
      body.variants = normalizedVariants
    }

    // Update product basic info
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription || null
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
    if (weight !== undefined) updateData.weight = weight ? String(weight) : null
    if (dimensions !== undefined) updateData.dimensions = dimensions ? String(dimensions) : null
    if (shippingFeeInsideDhaka !== undefined) updateData.shippingFeeInsideDhaka = shippingFeeInsideDhaka !== null && shippingFeeInsideDhaka !== '' ? parseFloat(shippingFeeInsideDhaka) : null
    if (shippingFeeOutsideDhaka !== undefined) updateData.shippingFeeOutsideDhaka = shippingFeeOutsideDhaka !== null && shippingFeeOutsideDhaka !== '' ? parseFloat(shippingFeeOutsideDhaka) : null
    if (warranty !== undefined) updateData.warranty = warranty ? String(warranty) : null
    if (vendor !== undefined) updateData.vendor = vendor ? String(vendor) : null
    if (status !== undefined) updateData.status = status === 'DRAFT' ? 'DRAFT' : 'ACTIVE'
    if (stock !== undefined) updateData.stock = parseInt(stock) || 0

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
    if (body.variants !== undefined) {
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
      if (body.variants.length > 0) {
        const variantInserts = body.variants.map((variant: EditableVariant, index: number) => ({
          id: variant.id || variant.sku || `var_${id}_${index}_${Date.now()}`, // Use existing ID, SKU, or generate unique ID
          productId: id,
          color: variant.color || null,
          size: variant.size || null,
          sku: variant.sku,
          stock: variant.stock ?? 0,
          priceModifier: variant.priceModifier ?? 0
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
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
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
    const admin = await requireModuleAccess('products')

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
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
