import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    await requireAdmin()

    // Get the file from the request
    const formData = await request.formData()
    const file = formData.get('logo') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type (images only)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and SVG are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 2MB.' },
        { status: 400 }
      )
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `brands/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('brand-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      // If bucket doesn't exist, provide helpful error
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Storage bucket "brand-logos" not found. Please create it in Supabase Dashboard first.' },
          { status: 500 }
        )
      }
      console.error('Upload error:', error)
      throw error
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('brand-logos')
      .getPublicUrl(filePath)

    return NextResponse.json({
      message: 'Logo uploaded successfully',
      url: publicUrl,
      path: filePath
    })
  } catch (error: any) {
    console.error('Error in POST /api/admin/brands/upload-logo:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload logo' },
      { status: 500 }
    )
  }
}
