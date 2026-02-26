import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireModuleAccess, requireAnyModuleAccess, AdminAuthError } from '@/lib/admin-auth'
import type { Vendor, VendorStatus, BusinessType } from '@/types/vendor'

/**
 * GET /api/admin/vendors
 * List all vendors with filtering and pagination
 * Requires admin authentication
 */
export async function GET(request: Request) {
  try {
    // Verify admin session — allow admins with 'products' access to read vendors (for dropdown)
    const admin = await requireAnyModuleAccess(['vendors', 'products'])

    // Extract query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') as VendorStatus | null
    const businessType = searchParams.get('businessType') as BusinessType | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query
    let query = supabase
      .from('Vendor')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.or(`shopName.ilike.%${search}%,ownerName.ilike.%${search}%,email.ilike.%${search}%,mobile.ilike.%${search}%`)
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    // Apply business type filter
    if (businessType) {
      query = query.eq('businessType', businessType)
    }

    // Order by creation date (newest first)
    query = query.order('createdAt', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Execute query
    const { data: vendors, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      vendors: vendors || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/vendors
 * Create a new vendor
 * Requires admin authentication
 */
export async function POST(request: Request) {
  try {
    // Verify admin session
    const admin = await requireModuleAccess('vendors')

    const body = await request.json()

    // Validate required fields
    const requiredFields = ['shopName', 'ownerName', 'mobile', 'email', 'pickupAddress']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if email already exists
    const { data: existingVendor } = await supabase
      .from('Vendor')
      .select('id')
      .eq('email', body.email)
      .single()

    if (existingVendor) {
      return NextResponse.json(
        { error: 'A vendor with this email already exists' },
        { status: 400 }
      )
    }

    // Build mobile banking object
    const mobileBanking: Record<string, string> = {}
    if (body.bkash) mobileBanking.bkash = body.bkash
    if (body.nagad) mobileBanking.nagad = body.nagad
    if (body.rocket) mobileBanking.rocket = body.rocket

    // Create vendor
    const vendorData = {
      shopName: body.shopName,
      ownerName: body.ownerName,
      mobile: body.mobile,
      email: body.email,
      businessType: body.businessType || 'INDIVIDUAL',
      nationalId: body.nationalId || null,
      tinNumber: body.tinNumber || null,
      pickupAddress: body.pickupAddress,
      returnAddress: body.returnAddress || null,
      status: body.status || 'ACTIVE',
      onboardingDate: body.onboardingDate || new Date().toISOString(),
      bankName: body.bankName || null,
      bankBranch: body.bankBranch || null,
      accountHolderName: body.accountHolderName || null,
      accountNumber: body.accountNumber || null,
      routingNumber: body.routingNumber || null,
      mobileBanking: Object.keys(mobileBanking).length > 0 ? mobileBanking : null,
      notes: body.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const { data: vendor, error } = await supabase
      .from('Vendor')
      .insert(vendorData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      vendor,
      message: 'Vendor created successfully'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}
