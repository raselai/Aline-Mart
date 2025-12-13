import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

// GET /api/admin/categories/[id] - Get single category with details
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Get params (Next.js 16 - params are async)
    const params = await props.params
    const { id } = params

    // Fetch category
    const { data: category, error } = await supabase
      .from('Category')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching category:', error)
      throw error
    }

    // Get product count
    const { count: productCount, error: countError } = await supabase
      .from('Product')
      .select('id', { count: 'exact', head: true })
      .eq('categoryId', category.id)

    if (countError) {
      console.error('Error counting products:', countError)
    }

    // Get children count (subcategories)
    const { count: childrenCount, error: childrenError } = await supabase
      .from('Category')
      .select('id', { count: 'exact', head: true })
      .eq('parentId', category.id)

    if (childrenError) {
      console.error('Error counting children:', childrenError)
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

    return NextResponse.json({
      category: {
        ...category,
        productCount: productCount || 0,
        childrenCount: childrenCount || 0,
        parentName
      }
    })
  } catch (error) {
    console.error('Error in GET /api/admin/categories/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/categories/[id] - Update category
export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Get params (Next.js 16 - params are async)
    const params = await props.params
    const { id } = params

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

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('Category')
      .select('id')
      .eq('id', parseInt(id))
      .single()

    if (checkError || !existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if slug is already used by another category
    const { data: slugCheck, error: slugError } = await supabase
      .from('Category')
      .select('id')
      .eq('slug', slug)
      .neq('id', parseInt(id))
      .single()

    if (slugError && slugError.code !== 'PGRST116') {
      console.error('Error checking slug:', slugError)
      throw slugError
    }

    if (slugCheck) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      )
    }

    // If parentId is provided, verify parent exists and prevent circular reference
    if (parentId) {
      // Can't be its own parent
      if (parseInt(parentId) === parseInt(id)) {
        return NextResponse.json(
          { error: 'A category cannot be its own parent' },
          { status: 400 }
        )
      }

      // Check if parent exists
      const { data: parent, error: parentError } = await supabase
        .from('Category')
        .select('id, parentId')
        .eq('id', parentId)
        .single()

      if (parentError || !parent) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        )
      }

      // Prevent circular reference (parent can't be a child of this category)
      const checkCircular = async (checkId: number, originalId: number): Promise<boolean> => {
        const { data: cat } = await supabase
          .from('Category')
          .select('parentId')
          .eq('id', checkId)
          .single()

        if (!cat || !cat.parentId) return false
        if (cat.parentId === originalId) return true
        return await checkCircular(cat.parentId, originalId)
      }

      const isCircular = await checkCircular(parseInt(parentId), parseInt(id))
      if (isCircular) {
        return NextResponse.json(
          { error: 'Cannot create circular category hierarchy' },
          { status: 400 }
        )
      }
    }

    // Update category
    const { data: updatedCategory, error: updateError } = await supabase
      .from('Category')
      .update({
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
        featured: featured || false,
        displayOrder: displayOrder || 0
      })
      .eq('id', parseInt(id))
      .select()
      .single()

    if (updateError) {
      console.error('Error updating category:', updateError)
      throw updateError
    }

    return NextResponse.json({
      message: 'Category updated successfully',
      category: updatedCategory
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/categories/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Get params (Next.js 16 - params are async)
    const params = await props.params
    const { id } = params

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('Category')
      .select('id, name')
      .eq('id', parseInt(id))
      .single()

    if (checkError || !existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products
    const { count: productCount, error: countError } = await supabase
      .from('Product')
      .select('id', { count: 'exact', head: true })
      .eq('categoryId', parseInt(id))

    if (countError) {
      console.error('Error counting products:', countError)
      throw countError
    }

    if (productCount && productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${existingCategory.name}" because it has ${productCount} product(s). Please reassign or delete the products first.`
        },
        { status: 409 }
      )
    }

    // Check if category has subcategories
    const { count: childrenCount, error: childrenError } = await supabase
      .from('Category')
      .select('id', { count: 'exact', head: true })
      .eq('parentId', parseInt(id))

    if (childrenError) {
      console.error('Error counting children:', childrenError)
      throw childrenError
    }

    if (childrenCount && childrenCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${existingCategory.name}" because it has ${childrenCount} subcategory(ies). Please delete or reassign the subcategories first.`
        },
        { status: 409 }
      )
    }

    // Delete category
    const { error: deleteError } = await supabase
      .from('Category')
      .delete()
      .eq('id', parseInt(id))

    if (deleteError) {
      console.error('Error deleting category:', deleteError)
      throw deleteError
    }

    return NextResponse.json({
      message: `Category "${existingCategory.name}" deleted successfully`
    })
  } catch (error) {
    console.error('Error in DELETE /api/admin/categories/[id]:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
