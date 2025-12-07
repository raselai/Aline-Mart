const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Map brand slugs to logo file numbers
// We have 22 brands and 19 logo files (1.jpg to 19.jpg)
const brandLogoMapping = {
  'rolex': '/Brands/1.jpg',
  'gucci': '/Brands/2.jpg',
  'louis-vuitton': '/Brands/3.jpg',
  'hermes': '/Brands/4.jpg',
  'chanel': '/Brands/5.jpg',
  'prada': '/Brands/6.jpg',
  'dior': '/Brands/7.jpg',
  'versace': '/Brands/8.jpg',
  'burberry': '/Brands/9.jpg',
  'cartier': '/Brands/10.jpg',
  'omega': '/Brands/11.jpg',
  'armani': '/Brands/12.jpg',
  'balenciaga': '/Brands/13.jpg',
  'givenchy': '/Brands/14.jpg',
  'ralph-lauren': '/Brands/15.jpg',
  'hugo-boss': '/Brands/16.jpg',
  'calvin-klein': '/Brands/17.jpg',
  'tommy-hilfiger': '/Brands/18.jpg',
  'michael-kors': '/Brands/19.jpg',
  'nike': '/Brands/1.jpg', // Reuse logos for remaining brands
  'adidas': '/Brands/2.jpg',
  'zara': '/Brands/3.jpg'
}

async function updateBrandLogos() {
  try {
    console.log('Updating brand logos with local files...\n')

    for (const [slug, logoPath] of Object.entries(brandLogoMapping)) {
      const { data, error } = await supabase
        .from('Brand')
        .update({ logo: logoPath })
        .eq('slug', slug)
        .select()

      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message)
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ${data[0].name} → ${logoPath}`)
      } else {
        console.log(`⚠️  Brand not found: ${slug}`)
      }
    }

    console.log('\n✅ All brand logos updated to local files!')
  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

updateBrandLogos()
