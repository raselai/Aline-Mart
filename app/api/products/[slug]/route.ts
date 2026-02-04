import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Fetch product with all details
    const { data: product, error } = await supabase
      .from('Product')
      .select(`
        *,
        brand:Brand!Product_brandId_fkey (
          id,
          name,
          slug,
          description
        ),
        category:Category!Product_categoryId_fkey (
          id,
          name,
          slug,
          parentId
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
      .eq('slug', slug)
      .or('status.is.null,status.eq.ACTIVE')
      .single()

    if (error || !product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      )
    }

    // Fetch related products (same brand or category)
    const { data: relatedProducts } = await supabase
      .from('Product')
      .select(`
        *,
        brand:Brand!Product_brandId_fkey (
          name,
          slug
        ),
        images:ProductImage (
          id,
          url,
          alt,
          order
        )
      `)
      .or(`brandId.eq.${product.brandId},categoryId.eq.${product.categoryId}`)
      .neq('id', product.id)
      .eq('inStock', true)
      .or('status.is.null,status.eq.ACTIVE')
      .order('createdAt', { ascending: false })
      .limit(6)

    const { costPrice: _costPrice, ...safeProduct } = product as any
    const safeRelatedProducts = (relatedProducts || []).map((relatedProduct: any) => {
      const { costPrice: _relatedCostPrice, ...safeRelatedProduct } = relatedProduct
      return safeRelatedProduct
    })

    return NextResponse.json({
      success: true,
      data: {
        product: safeProduct,
        relatedProducts: safeRelatedProducts,
      },
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
