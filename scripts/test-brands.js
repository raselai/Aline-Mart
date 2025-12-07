const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testBrands() {
  try {
    console.log('Fetching brands...')

    const { data, error } = await supabase
      .from('Brand')
      .select('id, name, slug, description, logo')
      .order('name', { ascending: true })

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    console.log(`✅ Found ${data?.length || 0} brands`)
    console.log('\nBrands:')
    data?.forEach(brand => {
      console.log(`  - ${brand.name} (slug: ${brand.slug})`)
    })
  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

testBrands()
