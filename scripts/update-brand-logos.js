const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Brand logo URLs from high-quality sources
const brandLogos = {
  'rolex': 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=400&fit=crop',
  'gucci': 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
  'louis-vuitton': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&h=400&fit=crop',
  'hermes': 'https://images.unsplash.com/photo-1591561954555-607968d87539?w=400&h=400&fit=crop',
  'chanel': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
  'prada': 'https://images.unsplash.com/photo-1591348278863-aa6e34ca1c3d?w=400&h=400&fit=crop',
  'dior': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=400&fit=crop',
  'versace': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
  'burberry': 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&h=400&fit=crop',
  'cartier': 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
  'omega': 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400&h=400&fit=crop',
  'armani': 'https://images.unsplash.com/photo-1585487000165-5c2371c22fce?w=400&h=400&fit=crop',
  'balenciaga': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop',
  'givenchy': 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&h=400&fit=crop',
  'ralph-lauren': 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
  'hugo-boss': 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop',
  'calvin-klein': 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400&h=400&fit=crop',
  'tommy-hilfiger': 'https://images.unsplash.com/photo-1581566694565-061c53c0e370?w=400&h=400&fit=crop',
  'michael-kors': 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop',
  'nike': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  'adidas': 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop',
  'zara': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop'
}

async function updateBrandLogos() {
  try {
    console.log('Updating brand logos...\n')

    for (const [slug, logoUrl] of Object.entries(brandLogos)) {
      const { data, error } = await supabase
        .from('Brand')
        .update({ logo: logoUrl })
        .eq('slug', slug)
        .select()

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message)
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ${data[0].name}`)
      } else {
        console.log(`⚠️  Brand not found: ${slug}`)
      }
    }

    console.log('\n✅ All brand logos updated!')
  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

updateBrandLogos()
