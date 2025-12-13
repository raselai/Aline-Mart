-- ============================================
-- DELETE ONLY TEST PRODUCTS (Keep Original Seed Data)
-- ============================================
-- This script deletes only the products YOU created during testing,
-- while preserving the original 28 seed products.
--
-- How it works:
-- - Original seed products have IDs like: prod_rolex-datejust, prod_gucci-marmont
-- - Your test products have IDs like: prod_test-*, prod_aqua-allegoria, prod_luxury-gold-watch
--
-- ⚠️ IMPORTANT: Review the "Products to Delete" list before running!
-- ============================================

-- Step 1: Show products that will be deleted
-- (Review this list carefully!)
SELECT
  id,
  name,
  "createdAt"
FROM "Product"
WHERE "createdAt" > '2025-12-13 00:00:00'  -- Change this date if needed
ORDER BY "createdAt" DESC;

-- Step 2: Delete images for test products
DELETE FROM "ProductImage"
WHERE "productId" IN (
  SELECT id FROM "Product"
  WHERE "createdAt" > '2025-12-13 00:00:00'
);

-- Step 3: Delete variants for test products
DELETE FROM "ProductVariant"
WHERE "productId" IN (
  SELECT id FROM "Product"
  WHERE "createdAt" > '2025-12-13 00:00:00'
);

-- Step 4: Delete test products
DELETE FROM "Product"
WHERE "createdAt" > '2025-12-13 00:00:00';

-- Step 5: Verify - show remaining products
SELECT
  COUNT(*) as remaining_products,
  MIN("createdAt") as oldest_product_date,
  MAX("createdAt") as newest_product_date
FROM "Product";

-- Step 6: List remaining products (should be original seed data)
SELECT
  id,
  name,
  "createdAt"
FROM "Product"
ORDER BY "createdAt" ASC
LIMIT 10;

-- ============================================
-- ALTERNATIVE: Delete by Product ID Pattern
-- ============================================
-- If you want to delete specific products by name pattern,
-- uncomment and modify this section:

/*
-- Delete products with specific ID patterns
DELETE FROM "ProductImage"
WHERE "productId" LIKE 'prod_test%'
   OR "productId" LIKE 'prod_aqua%'
   OR "productId" LIKE 'prod_luxury%';

DELETE FROM "ProductVariant"
WHERE "productId" LIKE 'prod_test%'
   OR "productId" LIKE 'prod_aqua%'
   OR "productId" LIKE 'prod_luxury%';

DELETE FROM "Product"
WHERE id LIKE 'prod_test%'
   OR id LIKE 'prod_aqua%'
   OR id LIKE 'prod_luxury%';
*/

-- ============================================
-- NEXT STEPS:
-- ============================================
-- 1. Clean up Supabase Storage for test images only
-- 2. Verify in admin dashboard
-- ============================================
