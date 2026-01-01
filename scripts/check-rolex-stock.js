/**
 * Check Rolex Product Stock
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkRolexStock() {
  console.log('🔍 Checking Rolex products...\n')

  const { data: products, error } = await supabase
    .from('Product')
    .select(`
      id,
      name,
      slug,
      price,
      Brand (name),
      variants:ProductVariant (
        id,
        color,
        size,
        stock
      )
    `)
    .ilike('name', '%rolex%')

  if (error) {
    console.error('Error:', error)
    return
  }

  if (!products || products.length === 0) {
    console.log('No Rolex products found')
    return
  }

  products.forEach(product => {
    console.log(`\n📦 ${product.name}`)
    console.log(`   Slug: ${product.slug}`)
    console.log(`   Brand: ${product.Brand?.name}`)
    console.log(`   Price: $${product.price}`)
    console.log(`\n   Variants:`)

    product.variants.forEach(variant => {
      const stockStatus = variant.stock > 0 ? '✅ IN STOCK' : '❌ OUT OF STOCK'
      console.log(`   - ID: ${variant.id}`)
      console.log(`     Color: ${variant.color || 'N/A'}, Size: ${variant.size || 'N/A'}`)
      console.log(`     Stock: ${variant.stock} ${stockStatus}`)
    })
  })
}

checkRolexStock()
