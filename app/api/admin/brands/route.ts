import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/brands - List all brands with product counts
export async function GET(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'name-asc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build query
    let query = supabase
      .from('Brand')
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

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: brands, error, count } = await query

    if (error) {
      console.error('Error fetching brands:', error)
      throw error
    }

    // Get product counts for each brand
    const brandsWithCounts = await Promise.all(
      (brands || []).map(async (brand) => {
        const { count: productCount, error: countError } = await supabase
          .from('Product')
          .select('id', { count: 'exact', head: true })
          .eq('brandId', brand.id)

        if (countError) {
          console.error('Error counting products for brand:', brand.id, countError)
        }

        return {
          ...brand,
          productCount: productCount || 0
        }
      })
    )

    return NextResponse.json({
      brands: brandsWithCounts,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error in GET /api/admin/brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

// POST /api/admin/brands - Create new brand
export async function POST(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Parse request body
    const body = await request.json()
    const { name, slug, description, logo, featured, displayOrder } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingBrand, error: checkError } = await supabase
      .from('Brand')
      .select('id')
      .eq('slug', slug)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (which is what we want)
      console.error('Error checking brand slug:', checkError)
      throw checkError
    }

    if (existingBrand) {
      return NextResponse.json(
        { error: 'A brand with this slug already exists' },
        { status: 409 }
      )
    }

    // Create brand
    const { data: newBrand, error: createError } = await supabase
      .from('Brand')
      .insert({
        name,
        slug,
        description: description || null,
        logo: logo || null,
        featured: featured || false,
        displayOrder: displayOrder || 0
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating brand:', createError)
      throw createError
    }

    return NextResponse.json({
      message: 'Brand created successfully',
      brand: newBrand
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/brands:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}
