/**
 * Add Stock to Product Variants
 *
 * This script adds stock to all product variants so you can test the checkout flow.
 * Run: node scripts/add-stock.js
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Please check your .env file for:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addStockToVariants() {
  try {
    console.log('🔍 Checking product variants...\n')

    // Get all product variants
    const { data: variants, error } = await supabase
      .from('ProductVariant')
      .select(`
        id,
        stock,
        Product (
          id,
          name
        )
      `)
      .order('id')

    if (error) {
      throw error
    }

    if (!variants || variants.length === 0) {
      console.log('⚠️  No product variants found in database')
      return
    }

    console.log(`Found ${variants.length} product variants\n`)

    // Count variants with no stock
    const outOfStock = variants.filter(v => v.stock === 0 || v.stock === null)
    const inStock = variants.filter(v => v.stock > 0)

    console.log(`📊 Current Stock Status:`)
    console.log(`   ✅ In Stock: ${inStock.length}`)
    console.log(`   ❌ Out of Stock: ${outOfStock.length}\n`)

    if (outOfStock.length === 0) {
      console.log('✅ All variants already have stock!')
      return
    }

    console.log('📦 Adding stock to out-of-stock variants...\n')

    // Update all variants to have stock between 5-20
    const updates = []
    for (const variant of variants) {
      const randomStock = Math.floor(Math.random() * 16) + 5 // Random between 5-20

      const { error: updateError } = await supabase
        .from('ProductVariant')
        .update({ stock: randomStock })
        .eq('id', variant.id)

      if (updateError) {
        console.error(`   ❌ Failed to update variant ${variant.id}:`, updateError.message)
      } else {
        console.log(`   ✅ ${variant.Product?.name || 'Unknown'} - Stock: ${randomStock}`)
        updates.push(variant.id)
      }
    }

    console.log(`\n✅ Successfully updated ${updates.length} product variants!`)
    console.log('\n🎉 All products now have stock available for testing!')
    console.log('\n📝 Next steps:')
    console.log('   1. Refresh your product page')
    console.log('   2. Click "Add to Cart" button')
    console.log('   3. Go to cart and click "Proceed to Checkout"')
    console.log('   4. Test the PayStation payment flow\n')

  } catch (error) {
    console.error('❌ Error adding stock:', error.message)
    process.exit(1)
  }
}

// Run the script
console.log('='.repeat(60))
console.log('📦 ADD STOCK TO PRODUCT VARIANTS')
console.log('='.repeat(60))
console.log()

addStockToVariants()
  .then(() => {
    console.log('='.repeat(60))
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
