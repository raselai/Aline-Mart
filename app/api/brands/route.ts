import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeProducts = searchParams.get('includeProducts') === 'true'

    // Fetch all brands
    const { data: brands, error } = await supabase
      .from('Brand')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    // If includeProducts is true, get product counts for each brand
    let brandsWithCounts = brands
    if (includeProducts && brands) {
      brandsWithCounts = await Promise.all(
        brands.map(async (brand) => {
          const { count } = await supabase
            .from('Product')
            .select('*', { count: 'exact', head: true })
            .eq('brandId', brand.id)
            .or('status.is.null,status.eq.ACTIVE')

          return {
            ...brand,
            _count: {
              products: count || 0
            }
          }
        })
      )
    }

    return NextResponse.json({
      success: true,
      data: brandsWithCounts,
      count: brands?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch brands',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
