import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET() {
  try {
    await requireAdmin()

    const { data, error } = await supabase
      .from('CategoryBanner')
      .select(`
        *,
        category:Category!CategoryBanner_categoryId_fkey (
          id,
          name,
          slug
        )
      `)
      .order('createdAt', { ascending: false })

    if (error) throw error

    return NextResponse.json({ banners: data || [] })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch banners'
    console.error('Error in GET /api/admin/category-banners:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const body = await request.json()
    const { categoryId, imageUrl, title, subtitle, linkUrl, isActive } = body

    if (!categoryId || !imageUrl) {
      return NextResponse.json(
        { error: 'categoryId and imageUrl are required' },
        { status: 400 }
      )
    }

    // Upsert: create or update banner for this category
    const id = `cb_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Check if banner already exists for this category
    const { data: existing } = await supabase
      .from('CategoryBanner')
      .select('id')
      .eq('categoryId', categoryId)
      .single()

    let data
    let error

    if (existing) {
      // Update existing
      const result = await supabase
        .from('CategoryBanner')
        .update({
          imageUrl,
          title: title || null,
          subtitle: subtitle || null,
          linkUrl: linkUrl || null,
          isActive: isActive !== undefined ? isActive : true,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      data = result.data
      error = result.error
    } else {
      // Create new
      const result = await supabase
        .from('CategoryBanner')
        .insert({
          id,
          categoryId,
          imageUrl,
          title: title || null,
          subtitle: subtitle || null,
          linkUrl: linkUrl || null,
          isActive: isActive !== undefined ? isActive : true,
        })
        .select()
        .single()

      data = result.data
      error = result.error
    }

    if (error) throw error

    return NextResponse.json({ banner: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save banner'
    console.error('Error in POST /api/admin/category-banners:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
