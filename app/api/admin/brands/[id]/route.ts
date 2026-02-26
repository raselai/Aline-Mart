import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, AdminAuthError } from '@/lib/admin-auth'

// GET /api/admin/brands/[id] - Get single brand with details
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireModuleAccess('brands')

    // Get params (Next.js 16 - params are async)
    const params = await props.params
    const { id } = params

    // Fetch brand
    const { data: brand, error } = await supabase
      .from('Brand')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Brand not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching brand:', error)
      throw error
    }

    // Get product count
    const { count: productCount, error: countError } = await supabase
      .from('Product')
      .select('id', { count: 'exact', head: true })
      .eq('brandId', brand.id)

    if (countError) {
      console.error('Error counting products:', countError)
    }

    return NextResponse.json({
      brand: {
        ...brand,
        productCount: productCount || 0
      }
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error in GET /api/admin/brands/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/brands/[id] - Update brand
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireModuleAccess('brands')

    // Get params (Next.js 16 - params are async)
    const params = await props.params
    const { id } = params

    // Parse request body
    const body = await request.json()
    const { name, slug, description, logo } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if brand exists
    const { data: existingBrand, error: checkError } = await supabase
      .from('Brand')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Check if slug is already used by another brand
    const { data: slugCheck, error: slugError } = await supabase
      .from('Brand')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .single()

    if (slugError && slugError.code !== 'PGRST116') {
      console.error('Error checking slug:', slugError)
      throw slugError
    }

    if (slugCheck) {
      return NextResponse.json(
        { error: 'A brand with this slug already exists' },
        { status: 409 }
      )
    }

    // Update brand
    const { data: updatedBrand, error: updateError } = await supabase
      .from('Brand')
      .update({
        name,
        slug,
        description: description || null,
        logo: logo || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating brand:', updateError)
      throw updateError
    }

    return NextResponse.json({
      message: 'Brand updated successfully',
      brand: updatedBrand
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error in PATCH /api/admin/brands/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/brands/[id] - Delete brand
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireModuleAccess('brands')

    // Get params (Next.js 16 - params are async)
    const params = await props.params
    const { id } = params

    // Check if brand exists
    const { data: existingBrand, error: checkError } = await supabase
      .from('Brand')
      .select('id, name')
      .eq('id', id)
      .single()

    if (checkError || !existingBrand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Check if brand has products
    const { count: productCount, error: countError } = await supabase
      .from('Product')
      .select('id', { count: 'exact', head: true })
      .eq('brandId', id)

    if (countError) {
      console.error('Error counting products:', countError)
      throw countError
    }

    if (productCount && productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete brand "${existingBrand.name}" because it has ${productCount} product(s). Please reassign or delete the products first.`
        },
        { status: 409 }
      )
    }

    // Delete brand
    const { error: deleteError } = await supabase
      .from('Brand')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting brand:', deleteError)
      throw deleteError
    }

    return NextResponse.json({
      message: `Brand "${existingBrand.name}" deleted successfully`
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error in DELETE /api/admin/brands/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    )
  }
}
