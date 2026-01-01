/**
 * Fix Rolex Product - Add Variant with Stock
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function fixRolexVariant() {
  console.log('🔧 Fixing Rolex product variant...\n')

  // Get the Rolex product
  const { data: product, error: productError } = await supabase
    .from('Product')
    .select('id, name, slug')
    .eq('slug', 'rolex')
    .single()

  if (productError || !product) {
    console.error('❌ Could not find Rolex product')
    return
  }

  console.log(`Found product: ${product.name} (ID: ${product.id})`)

  // Check if variants exist
  const { data: existingVariants, error: variantsError } = await supabase
    .from('ProductVariant')
    .select('*')
    .eq('productId', product.id)

  if (variantsError) {
    console.error('Error checking variants:', variantsError)
    return
  }

  console.log(`Current variants: ${existingVariants?.length || 0}`)

  if (existingVariants && existingVariants.length > 0) {
    // Update existing variants
    console.log('\n📦 Updating existing variants with stock...')

    for (const variant of existingVariants) {
      const { error: updateError } = await supabase
        .from('ProductVariant')
        .update({ stock: 10 })
        .eq('id', variant.id)

      if (updateError) {
        console.error(`   ❌ Failed to update variant ${variant.id}`)
      } else {
        console.log(`   ✅ Updated variant ${variant.id} - Stock: 10`)
      }
    }
  } else {
    // Create a new variant
    console.log('\n📦 Creating new variant with stock...')

    // Generate a unique variant ID
    const variantId = `var_rolex_silver_std_${Date.now()}`

    const { data: newVariant, error: createError } = await supabase
      .from('ProductVariant')
      .insert({
        id: variantId,
        productId: product.id,
        sku: `ROLEX-STD-001`,
        color: 'Silver',
        size: 'Standard',
        stock: 10
      })
      .select()

    if (createError) {
      console.error('   ❌ Failed to create variant:', createError.message)
    } else {
      console.log('   ✅ Created new variant with stock: 10')
      console.log('   Variant ID:', newVariant[0].id)
    }
  }

  console.log('\n✅ Rolex product is now ready for testing!')
  console.log('\n📝 Next steps:')
  console.log('   1. Refresh the product page (Ctrl+R or F5)')
  console.log('   2. The "Add to Cart" button should now be active')
  console.log('   3. Click "Add to Cart"')
  console.log('   4. Go to /cart and proceed to checkout\n')
}

fixRolexVariant()
