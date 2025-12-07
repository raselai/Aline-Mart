const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkDatabase() {
  try {
    const { count: productCount } = await supabase
      .from('Product')
      .select('*', { count: 'exact', head: true })

    const { count: brandCount } = await supabase
      .from('Brand')
      .select('*', { count: 'exact', head: true })

    const { count: categoryCount } = await supabase
      .from('Category')
      .select('*', { count: 'exact', head: true })

    const { count: imageCount } = await supabase
      .from('ProductImage')
      .select('*', { count: 'exact', head: true })

    const { count: variantCount } = await supabase
      .from('ProductVariant')
      .select('*', { count: 'exact', head: true })

    console.log('📊 Database Status:')
    console.log('==================')
    console.log(`Products: ${productCount || 0}`)
    console.log(`Brands: ${brandCount || 0}`)
    console.log(`Categories: ${categoryCount || 0}`)
    console.log(`Images: ${imageCount || 0}`)
    console.log(`Variants: ${variantCount || 0}`)
    console.log('')

    if (!productCount || productCount === 0) {
      console.log('⚠️  DATABASE IS EMPTY! No products found.')
      console.log('')
      console.log('Did you run the seed SQL in Supabase SQL Editor?')
      console.log('File: scripts/seed-complete.sql')
    } else {
      console.log('✅ Database has data!')

      // Show first few products
      const { data: products } = await supabase
        .from('Product')
        .select(`
          name,
          price,
          brand:Brand!Product_brandId_fkey (name)
        `)
        .limit(5)

      console.log('\nFirst 5 products:')
      products?.forEach(p => {
        console.log(`  - ${p.name} by ${p.brand.name} ($${p.price})`)
      })
    }
  } catch (error) {
    console.error('❌ Error checking database:', error.message)
  }
}

checkDatabase()
