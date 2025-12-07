// Simple script to test API routes
const BASE_URL = 'http://localhost:3000'

async function testAPI() {
  console.log('🧪 Testing Aline Mart API Routes...\n')

  // Test 1: Get all brands
  console.log('1️⃣  Testing /api/brands')
  try {
    const response = await fetch(`${BASE_URL}/api/brands`)
    const data = await response.json()
    console.log(`✅ Brands API: ${data.success ? 'SUCCESS' : 'FAILED'}`)
    console.log(`   Found ${data.count} brands`)
    console.log(`   First brand: ${data.data[0]?.name}\n`)
  } catch (error) {
    console.log(`❌ Brands API failed: ${error.message}\n`)
  }

  // Test 2: Get all categories
  console.log('2️⃣  Testing /api/categories')
  try {
    const response = await fetch(`${BASE_URL}/api/categories`)
    const data = await response.json()
    console.log(`✅ Categories API: ${data.success ? 'SUCCESS' : 'FAILED'}`)
    console.log(`   Found ${data.count} categories\n`)
  } catch (error) {
    console.log(`❌ Categories API failed: ${error.message}\n`)
  }

  // Test 3: Get all products
  console.log('3️⃣  Testing /api/products')
  try {
    const response = await fetch(`${BASE_URL}/api/products`)
    const data = await response.json()
    console.log(`✅ Products API: ${data.success ? 'SUCCESS' : 'FAILED'}`)
    console.log(`   Found ${data.pagination.totalCount} total products`)
    console.log(`   Showing ${data.data.length} products on page ${data.pagination.page}`)
    console.log(`   First product: ${data.data[0]?.name} - $${data.data[0]?.price}\n`)
  } catch (error) {
    console.log(`❌ Products API failed: ${error.message}\n`)
  }

  // Test 4: Get products with filters
  console.log('4️⃣  Testing /api/products with filters (featured only)')
  try {
    const response = await fetch(`${BASE_URL}/api/products?featured=true&limit=5`)
    const data = await response.json()
    console.log(`✅ Filtered Products API: ${data.success ? 'SUCCESS' : 'FAILED'}`)
    console.log(`   Found ${data.pagination.totalCount} featured products\n`)
  } catch (error) {
    console.log(`❌ Filtered Products API failed: ${error.message}\n`)
  }

  // Test 5: Get single product
  console.log('5️⃣  Testing /api/products/[slug] (Rolex Submariner)')
  try {
    const response = await fetch(`${BASE_URL}/api/products/rolex-submariner-date`)
    const data = await response.json()
    console.log(`✅ Single Product API: ${data.success ? 'SUCCESS' : 'FAILED'}`)
    if (data.success) {
      const product = data.data.product
      console.log(`   Product: ${product.name}`)
      console.log(`   Brand: ${product.brand.name}`)
      console.log(`   Price: $${product.price}`)
      console.log(`   Images: ${product.images.length}`)
      console.log(`   Variants: ${product.variants.length}`)
      console.log(`   Related products: ${data.data.relatedProducts.length}\n`)
    }
  } catch (error) {
    console.log(`❌ Single Product API failed: ${error.message}\n`)
  }

  console.log('🎉 API Testing Complete!\n')
}

testAPI().catch(console.error)
