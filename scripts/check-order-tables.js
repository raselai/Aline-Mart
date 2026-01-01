import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkOrderTables() {
  console.log('🔍 Checking Order System Tables...\n')

  try {
    // Check User table
    const { count: userCount, error: userError } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })

    if (userError) {
      console.log('❌ User table: NOT FOUND')
      console.log('   Error:', userError.message, '\n')
    } else {
      console.log(`✅ User table: EXISTS (${userCount} records)`)
    }

    // Check Address table
    const { count: addressCount, error: addressError } = await supabase
      .from('Address')
      .select('*', { count: 'exact', head: true })

    if (addressError) {
      console.log('❌ Address table: NOT FOUND')
      console.log('   Error:', addressError.message, '\n')
    } else {
      console.log(`✅ Address table: EXISTS (${addressCount} records)`)
    }

    // Check Order table
    const { count: orderCount, error: orderError } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })

    if (orderError) {
      console.log('❌ Order table: NOT FOUND')
      console.log('   Error:', orderError.message, '\n')
    } else {
      console.log(`✅ Order table: EXISTS (${orderCount} records)`)
    }

    // Check OrderItem table
    const { count: orderItemCount, error: orderItemError } = await supabase
      .from('OrderItem')
      .select('*', { count: 'exact', head: true })

    if (orderItemError) {
      console.log('❌ OrderItem table: NOT FOUND')
      console.log('   Error:', orderItemError.message, '\n')
    } else {
      console.log(`✅ OrderItem table: EXISTS (${orderItemCount} records)`)
    }

    // Check WishlistItem table
    const { count: wishlistCount, error: wishlistError } = await supabase
      .from('WishlistItem')
      .select('*', { count: 'exact', head: true })

    if (wishlistError) {
      console.log('❌ WishlistItem table: NOT FOUND')
      console.log('   Error:', wishlistError.message, '\n')
    } else {
      console.log(`✅ WishlistItem table: EXISTS (${wishlistCount} records)`)
    }

    // Check if Order table has payment fields
    console.log('\n🔍 Checking Payment Fields...\n')

    const { data: orderSchema, error: schemaError } = await supabase
      .from('Order')
      .select('*')
      .limit(1)

    if (!schemaError) {
      const sampleOrder = orderSchema[0] || {}
      const hasPaymentMethod = 'paymentMethod' in sampleOrder || orderCount === 0
      const hasShippingCost = 'shippingCost' in sampleOrder || orderCount === 0
      const hasPaystationTxId = 'paystationTransactionId' in sampleOrder || orderCount === 0

      if (hasPaymentMethod) {
        console.log('✅ Order.paymentMethod: EXISTS')
      } else {
        console.log('❌ Order.paymentMethod: MISSING')
      }

      if (hasShippingCost) {
        console.log('✅ Order.shippingCost: EXISTS')
      } else {
        console.log('❌ Order.shippingCost: MISSING')
      }

      if (hasPaystationTxId) {
        console.log('✅ Order.paystationTransactionId: EXISTS')
      } else {
        console.log('❌ Order.paystationTransactionId: MISSING')
      }

      // Check User.isGuest field
      const { data: userSchema, error: userSchemaError } = await supabase
        .from('User')
        .select('*')
        .limit(1)

      if (!userSchemaError) {
        const sampleUser = userSchema[0] || {}
        const hasIsGuest = 'isGuest' in sampleUser || userCount === 0

        if (hasIsGuest) {
          console.log('✅ User.isGuest: EXISTS')
        } else {
          console.log('❌ User.isGuest: MISSING')
        }
      }
    }

    console.log('\n✅ Order system check complete!\n')
    console.log('📝 If any tables are missing, run the migration SQL in Supabase dashboard.\n')

  } catch (error) {
    console.error('❌ Error checking tables:', error.message)
  }
}

checkOrderTables()
