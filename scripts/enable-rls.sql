-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================================================
--
-- WHAT THIS DOES:
-- 1. Enables RLS on every table (blocks all direct API access by default)
-- 2. Adds read-only policies for public catalog data (products, brands, etc.)
-- 3. Locks down all sensitive tables (users, orders, cards, admin data)
--
-- Your Next.js API routes use the service_role key which BYPASSES RLS,
-- so all your app functionality continues working normally.
-- Only direct Supabase API access with the anon key is restricted.
-- ============================================================================


-- ============================================================================
-- STEP 1: Enable RLS on ALL tables
-- ============================================================================

ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Brand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CategoryBanner" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WishlistItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SignatureCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CardTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CardOTP" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_permissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_activity_log" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Refund" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CODCollection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vendor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VendorPayout" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on deprecated tables (if they still exist)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'VirtualCard_deprecated') THEN
    EXECUTE 'ALTER TABLE "VirtualCard_deprecated" ENABLE ROW LEVEL SECURITY';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'VirtualCardTransaction_deprecated') THEN
    EXECUTE 'ALTER TABLE "VirtualCardTransaction_deprecated" ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Enable RLS on settings and InventoryLog if they exist
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settings') THEN
    EXECUTE 'ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY';
    -- Settings are read-only for public (card type configs, etc.)
    EXECUTE 'CREATE POLICY "Allow public read settings" ON "settings" FOR SELECT TO anon USING (true)';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'InventoryLog') THEN
    EXECUTE 'ALTER TABLE "InventoryLog" ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;


-- ============================================================================
-- STEP 2: Drop existing policies (clean slate)
-- ============================================================================

-- Drop the existing policy on User table that was created but RLS wasn't enabled
DROP POLICY IF EXISTS "Allow anon select" ON "User";


-- ============================================================================
-- STEP 3: PUBLIC READ-ONLY policies (catalog data visible to everyone)
-- ============================================================================

-- Products: anyone can browse products
CREATE POLICY "Public read products"
  ON "Product" FOR SELECT TO anon
  USING (true);

-- Brands: anyone can browse brands
CREATE POLICY "Public read brands"
  ON "Brand" FOR SELECT TO anon
  USING (true);

-- Categories: anyone can browse categories
CREATE POLICY "Public read categories"
  ON "Category" FOR SELECT TO anon
  USING (true);

-- Product images: anyone can view product images
CREATE POLICY "Public read product images"
  ON "ProductImage" FOR SELECT TO anon
  USING (true);

-- Product variants: anyone can view variants (for size/color selection)
CREATE POLICY "Public read product variants"
  ON "ProductVariant" FOR SELECT TO anon
  USING (true);

-- Category banners: anyone can view banners
CREATE POLICY "Public read category banners"
  ON "CategoryBanner" FOR SELECT TO anon
  USING (true);

-- Vendors: public read for brand/vendor display
CREATE POLICY "Public read vendors"
  ON "Vendor" FOR SELECT TO anon
  USING (true);


-- ============================================================================
-- STEP 4: NO public access for sensitive tables
-- (These tables have NO anon policies = completely blocked from direct API)
-- ============================================================================

-- User: NO public access (passwords, emails, personal data)
-- Order: NO public access (order details, amounts)
-- OrderItem: NO public access
-- Address: NO public access (personal addresses)
-- WishlistItem: NO public access
-- SignatureCard: NO public access (card numbers, balances)
-- CardTransaction: NO public access (financial data)
-- CardOTP: NO public access (security codes)
-- admin_permissions: NO public access
-- admin_activity_log: NO public access
-- Transaction: NO public access (financial records)
-- Refund: NO public access
-- CODCollection: NO public access
-- VendorPayout: NO public access
-- InventoryLog: NO public access


-- ============================================================================
-- DONE! Verify with:
-- ============================================================================
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
