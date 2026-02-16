import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    await requireAdmin()

    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB for hero images)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `hero/${fileName}`

    // Convert File to Buffer for server-side upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('hero-images')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Storage bucket "hero-images" not found. Please create it in Supabase Dashboard first.' },
          { status: 500 }
        )
      }
      console.error('Upload error:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('hero-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: publicUrl,
      path: filePath
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload image'
    console.error('Error in POST /api/admin/hero/upload:', error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
