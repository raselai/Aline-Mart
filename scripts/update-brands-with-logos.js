const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// 19 brands with logos (1.jpg to 19.jpg)
const brandsWithLogos = [
  { name: 'Rolex', slug: 'rolex', logo: '/Brands/1.jpg', description: 'Swiss luxury watchmaker renowned for precision and prestige' },
  { name: 'Gucci', slug: 'gucci', logo: '/Brands/2.jpg', description: 'Italian luxury fashion house known for leather goods and ready-to-wear' },
  { name: 'Louis Vuitton', slug: 'louis-vuitton', logo: '/Brands/3.jpg', description: 'French fashion house specializing in luxury trunks and leather goods' },
  { name: 'Hermès', slug: 'hermes', logo: '/Brands/4.jpg', description: 'French luxury manufacturer of leather, lifestyle accessories, and ready-to-wear' },
  { name: 'Chanel', slug: 'chanel', logo: '/Brands/5.jpg', description: 'French luxury fashion house known for haute couture and fragrances' },
  { name: 'Prada', slug: 'prada', logo: '/Brands/6.jpg', description: 'Italian luxury fashion house known for leather handbags and ready-to-wear' },
  { name: 'Dior', slug: 'dior', logo: '/Brands/7.jpg', description: 'French luxury fashion house known for haute couture and accessories' },
  { name: 'Versace', slug: 'versace', logo: '/Brands/8.jpg', description: 'Italian luxury fashion company known for bold prints and glamorous designs' },
  { name: 'Burberry', slug: 'burberry', logo: '/Brands/9.jpg', description: 'British luxury fashion house known for trench coats and check pattern' },
  { name: 'Cartier', slug: 'cartier', logo: '/Brands/10.jpg', description: 'French luxury jeweler and watchmaker known for fine jewelry' },
  { name: 'Omega', slug: 'omega', logo: '/Brands/11.jpg', description: 'Swiss luxury watchmaker known for precision timepieces' },
  { name: 'Armani', slug: 'armani', logo: '/Brands/12.jpg', description: 'Italian luxury fashion house known for elegant menswear and accessories' },
  { name: 'Balenciaga', slug: 'balenciaga', logo: '/Brands/13.jpg', description: 'Spanish luxury fashion house known for innovative and modern designs' },
  { name: 'Givenchy', slug: 'givenchy', logo: '/Brands/14.jpg', description: 'French luxury fashion and perfume house known for haute couture' },
  { name: 'Ralph Lauren', slug: 'ralph-lauren', logo: '/Brands/15.jpg', description: 'American fashion company known for classic and preppy style' },
  { name: 'Hugo Boss', slug: 'hugo-boss', logo: '/Brands/16.jpg', description: 'German luxury fashion house specializing in menswear and fragrances' },
  { name: 'Calvin Klein', slug: 'calvin-klein', logo: '/Brands/17.jpg', description: 'American fashion brand known for minimalist designs and denim' },
  { name: 'Tommy Hilfiger', slug: 'tommy-hilfiger', logo: '/Brands/18.jpg', description: 'American fashion brand known for classic American style' },
  { name: 'Michael Kors', slug: 'michael-kors', logo: '/Brands/19.jpg', description: 'American fashion brand known for luxury accessories and ready-to-wear' }
]

async function updateBrands() {
  try {
    console.log('Updating brands to match available logos...\n')

    // First, get all existing brands
    const { data: existingBrands, error: fetchError } = await supabase
      .from('Brand')
      .select('id, slug')

    if (fetchError) {
      console.error('Error fetching brands:', fetchError)
      return
    }

    console.log(`Found ${existingBrands.length} existing brands`)

    // Update the first 19 brands with our new data
    for (let i = 0; i < brandsWithLogos.length; i++) {
      const brand = brandsWithLogos[i]
      const existingBrand = existingBrands[i]

      if (existingBrand) {
        const { data, error } = await supabase
          .from('Brand')
          .update({
            name: brand.name,
            slug: brand.slug,
            logo: brand.logo,
            description: brand.description
          })
          .eq('id', existingBrand.id)
          .select()

        if (error) {
          console.error(`❌ Error updating brand ${i + 1}:`, error.message)
        } else {
          console.log(`✅ Updated: ${brand.name} → ${brand.logo}`)
        }
      }
    }

    // Delete the remaining brands (20-22)
    if (existingBrands.length > 19) {
      console.log('\nRemoving extra brands...')
      const brandsToDelete = existingBrands.slice(19)

      for (const brand of brandsToDelete) {
        const { error } = await supabase
          .from('Brand')
          .delete()
          .eq('id', brand.id)

        if (error) {
          console.error(`❌ Error deleting brand:`, error.message)
        } else {
          console.log(`🗑️  Deleted brand: ${brand.slug}`)
        }
      }
    }

    console.log('\n✅ Brand update complete!')
    console.log(`Total brands: 19`)
  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

updateBrands()
