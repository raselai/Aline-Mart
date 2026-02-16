import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await props.params

    const body = await request.json()
    const { imageUrl, title, subtitle, linkUrl, isActive } = body

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    }

    if (imageUrl !== undefined) updateData.imageUrl = imageUrl
    if (title !== undefined) updateData.title = title || null
    if (subtitle !== undefined) updateData.subtitle = subtitle || null
    if (linkUrl !== undefined) updateData.linkUrl = linkUrl || null
    if (isActive !== undefined) updateData.isActive = isActive

    const { data, error } = await supabase
      .from('CategoryBanner')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ banner: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update banner'
    console.error('Error in PUT /api/admin/category-banners/[id]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await props.params

    // Get banner to find image path for cleanup
    const { data: banner } = await supabase
      .from('CategoryBanner')
      .select('imageUrl')
      .eq('id', id)
      .single()

    // Delete the banner row
    const { error } = await supabase
      .from('CategoryBanner')
      .delete()
      .eq('id', id)

    if (error) throw error

    // Attempt to delete the image from storage
    if (banner?.imageUrl) {
      try {
        const url = new URL(banner.imageUrl)
        const pathMatch = url.pathname.match(/category-banners\/(.+)$/)
        if (pathMatch) {
          await supabase.storage
            .from('category-banners')
            .remove([pathMatch[1]])
        }
      } catch {
        // Image cleanup is best-effort
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete banner'
    console.error('Error in DELETE /api/admin/category-banners/[id]:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
