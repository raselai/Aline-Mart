const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Correct brand names matching the logos in public/Brands/
const correctBrands = [
  { name: 'Garden', slug: 'garden', logo: '/Brands/1.jpg', description: 'Premium organic lifestyle brand' },
  { name: 'Zenith', slug: 'zenith', logo: '/Brands/2.jpg', description: 'Swiss luxury watchmaker since 1865' },
  { name: 'TAG Heuer', slug: 'tag-heuer', logo: '/Brands/3.jpg', description: 'Swiss luxury watchmaker since 1860' },
  { name: 'Azzaro', slug: 'azzaro', logo: '/Brands/4.jpg', description: 'French luxury fashion and fragrance house' },
  { name: 'Guerlain', slug: 'guerlain', logo: '/Brands/5.jpg', description: 'French perfume and cosmetics house' },
  { name: 'Burberry', slug: 'burberry', logo: '/Brands/6.jpg', description: 'British luxury fashion house known for trench coats' },
  { name: 'Patek Philippe', slug: 'patek-philippe', logo: '/Brands/7.jpg', description: 'Swiss luxury watch manufacturer' },
  { name: 'Givenchy', slug: 'givenchy', logo: '/Brands/8.jpg', description: 'French luxury fashion and perfume house' },
  { name: 'Giorgio Armani', slug: 'giorgio-armani', logo: '/Brands/9.jpg', description: 'Italian luxury fashion house' },
  { name: 'IWC Schaffhausen', slug: 'iwc-schaffhausen', logo: '/Brands/10.jpg', description: 'Swiss luxury watch manufacturer' },
  { name: 'Sandbox', slug: 'sandbox', logo: '/Brands/11.jpg', description: 'Contemporary lifestyle brand' },
  { name: 'Hublot', slug: 'hublot', logo: '/Brands/12.jpg', description: 'Swiss luxury watchmaker' },
  { name: 'Dolce & Gabbana', slug: 'dolce-gabbana', logo: '/Brands/13.jpg', description: 'Italian luxury fashion house' },
  { name: 'Cartier', slug: 'cartier', logo: '/Brands/14.jpg', description: 'French luxury jeweler and watchmaker' },
  { name: 'Breitling', slug: 'breitling', logo: '/Brands/15.jpg', description: 'Swiss luxury watchmaker since 1884' },
  { name: 'Rolex', slug: 'rolex', logo: '/Brands/16.jpg', description: 'Swiss luxury watchmaker renowned for precision' },
  { name: 'Hugo Boss', slug: 'hugo-boss', logo: '/Brands/17.jpg', description: 'German luxury fashion house' },
  { name: 'Calvin Klein', slug: 'calvin-klein', logo: '/Brands/18.jpg', description: 'American fashion brand known for minimalist designs' },
  { name: 'Dior', slug: 'dior', logo: '/Brands/19.jpg', description: 'French luxury fashion house' }
]

async function updateAllBrands() {
  try {
    console.log('Updating all brands to match logo files...\n')

    // Get all existing brands
    const { data: existingBrands } = await supabase
      .from('Brand')
      .select('id')
      .order('id', { ascending: true })

    if (!existingBrands || existingBrands.length === 0) {
      console.log('No brands found in database')
      return
    }

    console.log(`Found ${existingBrands.length} existing brands\n`)

    // Update each brand
    for (let i = 0; i < correctBrands.length && i < existingBrands.length; i++) {
      const brand = correctBrands[i]
      const existingBrand = existingBrands[i]

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
        console.log(`✅ ${i + 1}. ${brand.name} → ${brand.logo}`)
      }
    }

    console.log('\n✅ All brands updated successfully!')
    console.log(`Total: ${correctBrands.length} brands`)
  } catch (err) {
    console.error('❌ Exception:', err)
  }
}

updateAllBrands()
