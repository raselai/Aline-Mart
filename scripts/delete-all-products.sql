-- ============================================
-- DELETE ALL PRODUCTS FROM DATABASE
-- ============================================
-- This script will permanently delete ALL products, images, and variants
-- from the Supabase database.
--
-- ⚠️ WARNING: THIS CANNOT BE UNDONE!
--
-- What this deletes:
-- - All products (Product table)
-- - All product images (ProductImage table)
-- - All product variants (ProductVariant table)
--
-- What this does NOT delete:
-- - Uploaded images in Supabase Storage (delete manually in Storage > product-images)
-- - Brands (Brand table)
-- - Categories (Category table)
-- - Users (User table)
-- - Orders (Order table)
--
-- Usage:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Click "New query"
-- 3. Copy and paste this entire script
-- 4. Click "Run"
-- ============================================

-- Step 1: Show current counts (before deletion)
SELECT
  (SELECT COUNT(*) FROM "Product") as total_products,
  (SELECT COUNT(*) FROM "ProductImage") as total_images,
  (SELECT COUNT(*) FROM "ProductVariant") as total_variants;

-- Step 2: Delete all product images
-- (Must delete children first due to foreign key constraints)
DELETE FROM "ProductImage";

-- Step 3: Delete all product variants
DELETE FROM "ProductVariant";

-- Step 4: Delete all products
DELETE FROM "Product";

-- Step 5: Verify deletion (should all return 0)
SELECT
  (SELECT COUNT(*) FROM "Product") as remaining_products,
  (SELECT COUNT(*) FROM "ProductImage") as remaining_images,
  (SELECT COUNT(*) FROM "ProductVariant") as remaining_variants;

-- Step 6: Show success message
SELECT 'All products deleted successfully!' as status;

-- ============================================
-- NEXT STEPS AFTER RUNNING THIS SCRIPT:
-- ============================================
-- 1. Clean up Supabase Storage:
--    - Go to Storage → product-images → products/
--    - Select all uploaded images
--    - Click Delete
--
-- 2. (Optional) Re-seed with demo products:
--    - Run: scripts/seed-complete.sql
--    - This will add back the original 28 demo products
--
-- 3. Verify in admin dashboard:
--    - Go to http://localhost:3000/admin/products
--    - Should show "No products found"
-- ============================================
