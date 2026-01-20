import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/admin/vendors/[id]
 * Get a single vendor by ID
 * Requires admin authentication
 */
export async function GET(request: Request, props: RouteParams) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params

    const { data: vendor, error } = await supabase
      .from('Vendor')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Vendor not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ vendor })
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vendor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/vendors/[id]
 * Update a vendor
 * Requires admin authentication
 */
export async function PUT(request: Request, props: RouteParams) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params
    const body = await request.json()

    // Check if vendor exists
    const { data: existingVendor, error: fetchError } = await supabase
      .from('Vendor')
      .select('id, email')
      .eq('id', id)
      .single()

    if (fetchError || !existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Check if email is being changed and if new email already exists
    if (body.email && body.email !== existingVendor.email) {
      const { data: emailCheck } = await supabase
        .from('Vendor')
        .select('id')
        .eq('email', body.email)
        .neq('id', id)
        .single()

      if (emailCheck) {
        return NextResponse.json(
          { error: 'A vendor with this email already exists' },
          { status: 400 }
        )
      }
    }

    // Build mobile banking object
    const mobileBanking: Record<string, string> = {}
    if (body.bkash) mobileBanking.bkash = body.bkash
    if (body.nagad) mobileBanking.nagad = body.nagad
    if (body.rocket) mobileBanking.rocket = body.rocket

    // Build update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    }

    // Only include fields that are provided
    if (body.shopName !== undefined) updateData.shopName = body.shopName
    if (body.ownerName !== undefined) updateData.ownerName = body.ownerName
    if (body.mobile !== undefined) updateData.mobile = body.mobile
    if (body.email !== undefined) updateData.email = body.email
    if (body.businessType !== undefined) updateData.businessType = body.businessType
    if (body.nationalId !== undefined) updateData.nationalId = body.nationalId || null
    if (body.tinNumber !== undefined) updateData.tinNumber = body.tinNumber || null
    if (body.pickupAddress !== undefined) updateData.pickupAddress = body.pickupAddress
    if (body.returnAddress !== undefined) updateData.returnAddress = body.returnAddress || null
    if (body.status !== undefined) updateData.status = body.status
    if (body.onboardingDate !== undefined) updateData.onboardingDate = body.onboardingDate
    if (body.bankName !== undefined) updateData.bankName = body.bankName || null
    if (body.bankBranch !== undefined) updateData.bankBranch = body.bankBranch || null
    if (body.accountHolderName !== undefined) updateData.accountHolderName = body.accountHolderName || null
    if (body.accountNumber !== undefined) updateData.accountNumber = body.accountNumber || null
    if (body.routingNumber !== undefined) updateData.routingNumber = body.routingNumber || null
    if (body.notes !== undefined) updateData.notes = body.notes || null

    // Update mobile banking if any mobile banking field is provided
    if (body.bkash !== undefined || body.nagad !== undefined || body.rocket !== undefined) {
      updateData.mobileBanking = Object.keys(mobileBanking).length > 0 ? mobileBanking : null
    }

    const { data: vendor, error } = await supabase
      .from('Vendor')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      vendor,
      message: 'Vendor updated successfully'
    })

  } catch (error) {
    console.error('Error updating vendor:', error)
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/vendors/[id]
 * Delete a vendor
 * Requires admin authentication
 */
export async function DELETE(request: Request, props: RouteParams) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const params = await props.params
    const { id } = params

    // Check if vendor exists
    const { data: existingVendor, error: fetchError } = await supabase
      .from('Vendor')
      .select('id, shopName')
      .eq('id', id)
      .single()

    if (fetchError || !existingVendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      )
    }

    // Delete the vendor
    const { error } = await supabase
      .from('Vendor')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: `Vendor "${existingVendor.shopName}" deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting vendor:', error)
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    )
  }
}
