import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeProducts = searchParams.get('includeProducts') === 'true'

    // Fetch all categories
    const { data: categories, error } = await supabase
      .from('Category')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    // Build hierarchical structure manually
    let categoriesWithData = categories || []

    if (includeProducts && categories) {
      categoriesWithData = await Promise.all(
        categories.map(async (category) => {
          const { count } = await supabase
            .from('Product')
            .select('*', { count: 'exact', head: true })
            .eq('categoryId', category.id)
            .or('status.is.null,status.eq.ACTIVE')

          return {
            ...category,
            _count: {
              products: count || 0
            }
          }
        })
      )
    }

    // Organize into tree structure (only root categories)
    const categoryTree = categoriesWithData.filter((cat) => !cat.parentId)

    return NextResponse.json({
      success: true,
      data: {
        all: categoriesWithData, // Flat list
        tree: categoryTree, // Hierarchical structure
      },
      count: categoriesWithData.length,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
