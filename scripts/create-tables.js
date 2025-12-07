/**
 * Create Database Tables via Supabase SQL API
 * This script creates all tables defined in the Prisma schema
 * using Supabase's REST API to bypass connection issues
 */

const SUPABASE_URL = 'https://rzalfxuexvdcgydxffeh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6YWxmeHVleHZkY2d5ZHhmZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTk3OTQsImV4cCI6MjA4MDQ3NTc5NH0.GuZNUP-e-4-HiVhbt5qeLJ-la6xop_lZq1vYeYwd0I8';

// SQL to create all tables from Prisma schema
const createTablesSQL = `
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create Brand table
CREATE TABLE IF NOT EXISTS "Brand" (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  "parentId" TEXT,
  FOREIGN KEY ("parentId") REFERENCES "Category"(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  "salePrice" DOUBLE PRECISION,
  "brandId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  "isNew" BOOLEAN NOT NULL DEFAULT false,
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("brandId") REFERENCES "Brand"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create ProductImage table
CREATE TABLE IF NOT EXISTS "ProductImage" (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "productId" TEXT NOT NULL,
  FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create ProductVariant table
CREATE TABLE IF NOT EXISTS "ProductVariant" (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  color TEXT,
  size TEXT,
  sku TEXT UNIQUE NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
  FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Address table
CREATE TABLE IF NOT EXISTS "Address" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  phone TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  "zipCode" TEXT NOT NULL,
  country TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY,
  "orderNumber" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL,
  total DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  "shippingAddressId" TEXT NOT NULL,
  "stripePaymentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY ("shippingAddressId") REFERENCES "Address"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create OrderItem table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productName" TEXT NOT NULL,
  "brandName" TEXT NOT NULL,
  "variantId" TEXT,
  quantity INTEGER NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  total DOUBLE PRECISION NOT NULL,
  FOREIGN KEY ("orderId") REFERENCES "Order"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create WishlistItem table
CREATE TABLE IF NOT EXISTS "WishlistItem" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE("userId", "productId")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "ProductImage_productId_idx" ON "ProductImage"("productId");
CREATE INDEX IF NOT EXISTS "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "WishlistItem_userId_idx" ON "WishlistItem"("userId");

SELECT 'Tables created successfully!' as result;
`;

async function createTables() {
  console.log('🚀 Creating database tables via Supabase REST API...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ query: createTablesSQL })
    });

    if (!response.ok) {
      // Try alternative approach using the SQL endpoint
      console.log('Trying alternative SQL execution method...\n');

      const response2 = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ sql: createTablesSQL })
      });

      if (!response2.ok) {
        throw new Error(`Failed to create tables: ${response2.status} ${response2.statusText}`);
      }
    }

    console.log('✅ Tables created successfully!\n');
    console.log('📋 Tables created:');
    console.log('   - User');
    console.log('   - Brand');
    console.log('   - Category');
    console.log('   - Product');
    console.log('   - ProductImage');
    console.log('   - ProductVariant');
    console.log('   - Order');
    console.log('   - OrderItem');
    console.log('   - Address');
    console.log('   - WishlistItem\n');
    console.log('🎉 Database setup complete! You can now run the seed script.\n');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('Since the REST API approach failed, please:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy the SQL from scripts/create-tables.sql');
    console.log('3. Paste and run it in the SQL Editor\n');
    process.exit(1);
  }
}

createTables();
