const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function removeExtraBrands() {
  try {
    console.log('Checking brands to remove...\n')

    // Get all brands
    const { data: allBrands } = await supabase
      .from('Brand')
      .select('id, name, slug')
      .order('name', { ascending: true })

    console.log(`Total brands: ${allBrands.length}`)
    console.log('\nBrands to remove (last 3):')

    const brandsToRemove = ['nike', 'adidas', 'zara']

    for (const slug of brandsToRemove) {
      const brand = allBrands.find(b => b.slug === slug)
      if (brand) {
        console.log(`  - ${brand.name} (${brand.slug})`)

        // Check if any products use this brand
        const { count } = await supabase
          .from('Product')
          .select('*', { count: 'exact', head: true })
          .eq('brandId', brand.id)

        console.log(`    Products using this brand: ${count}`)

        if (count > 0) {
          // Reassign products to Rolex (first brand)
          const { data: rolex } = await supabase
            .from('Brand')
            .select('id')
            .eq('slug', 'rolex')
            .single()

          if (rolex) {
            console.log(`    → Reassigning ${count} products to Rolex`)

            const { error: updateError } = await supabase
              .from('Product')
              .update({ brandId: rolex.id })
              .eq('brandId', brand.id)

            if (updateError) {
              console.error(`    ❌ Error reassigning products:`, updateError.message)
            } else {
              console.log(`    ✅ Products reassigned`)
            }
          }
        }

        // Now delete the brand
        const { error: deleteError } = await supabase
          .from('Brand')
          .delete()
          .eq('id', brand.id)

        if (deleteError) {
          console.error(`    ❌ Error deleting brand:`, deleteError.message)
        } else {
          console.log(`    ✅ Brand deleted`)
        }
      }
    }

    console.log('\n✅ Complete!')
  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

removeExtraBrands()
