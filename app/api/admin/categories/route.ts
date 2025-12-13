import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/categories - List all categories with hierarchy
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'name-asc'
    const includeHierarchy = searchParams.get('hierarchy') === 'true'

    // Build query
    let query = supabase
      .from('Category')
      .select('*', { count: 'exact' })

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    // Sorting
    const [sortField, sortOrder] = sort.split('-')
    if (sortField === 'name') {
      query = query.order('name', { ascending: sortOrder === 'asc' })
    } else if (sortField === 'created') {
      query = query.order('createdAt', { ascending: sortOrder === 'asc' })
    } else if (sortField === 'displayOrder') {
      query = query.order('displayOrder', { ascending: sortOrder === 'asc' })
    }

    // Execute query
    const { data: categories, error, count } = await query

    if (error) {
      console.error('Error fetching categories:', error)
      throw error
    }

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      (categories || []).map(async (category) => {
        const { count: productCount, error: countError } = await supabase
          .from('Product')
          .select('id', { count: 'exact', head: true })
          .eq('categoryId', category.id)

        if (countError) {
          console.error('Error counting products for category:', category.id, countError)
        }

        // Get parent category name if exists
        let parentName = null
        if (category.parentId) {
          const { data: parent } = await supabase
            .from('Category')
            .select('name')
            .eq('id', category.parentId)
            .single()

          if (parent) {
            parentName = parent.name
          }
        }

        return {
          ...category,
          productCount: productCount || 0,
          parentName
        }
      })
    )

    // Build hierarchy if requested
    if (includeHierarchy) {
      const buildHierarchy = (categories: any[], parentId: number | null = null): any[] => {
        return categories
          .filter(cat => cat.parentId === parentId)
          .map(cat => ({
            ...cat,
            children: buildHierarchy(categories, cat.id)
          }))
      }

      const hierarchy = buildHierarchy(categoriesWithCounts)

      return NextResponse.json({
        categories: categoriesWithCounts,
        hierarchy,
        total: count || 0
      })
    }

    return NextResponse.json({
      categories: categoriesWithCounts,
      total: count || 0
    })
  } catch (error) {
    console.error('Error in GET /api/admin/categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Parse request body
    const body = await request.json()
    const { name, slug, description, parentId, featured, displayOrder } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('Category')
      .select('id')
      .eq('slug', slug)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is what we want)
      console.error('Error checking category slug:', checkError)
      throw checkError
    }

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      )
    }

    // If parentId is provided, verify parent exists
    if (parentId) {
      const { data: parent, error: parentError } = await supabase
        .from('Category')
        .select('id')
        .eq('id', parentId)
        .single()

      if (parentError || !parent) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        )
      }
    }

    // Create category
    const { data: newCategory, error: createError } = await supabase
      .from('Category')
      .insert({
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        featured: featured || false,
        displayOrder: displayOrder || 0
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating category:', createError)
      throw createError
    }

    return NextResponse.json({
      message: 'Category created successfully',
      category: newCategory
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
