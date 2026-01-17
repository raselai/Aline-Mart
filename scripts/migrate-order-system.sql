-- ============================================
-- Aline Mart - Order System Migration
-- ============================================
-- Run this SQL in your Supabase SQL Editor to add
-- the required columns for the order management system.
-- ============================================

-- 1. Add paymentMethod column to Order table
-- Values: 'PAYSTATION' or 'COD'
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT NOT NULL DEFAULT 'COD';

-- Add check constraint for paymentMethod
ALTER TABLE "Order"
DROP CONSTRAINT IF EXISTS "Order_paymentMethod_check";

ALTER TABLE "Order"
ADD CONSTRAINT "Order_paymentMethod_check"
CHECK ("paymentMethod" IN ('PAYSTATION', 'COD'));

-- 2. Add shippingCost column to Order table
-- COD orders have shipping cost (e.g., 50), PayStation is free (0)
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- 3. Add paystationTransactionId column to Order table
-- Stores the PayStation transaction ID after successful payment
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "paystationTransactionId" TEXT;

-- 4. Add variantName column to OrderItem table
-- Stores the variant display name (e.g., "Black / M" or "Standard")
ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "variantName" TEXT;

-- 5. Add isGuest column to User table
-- true for guest checkout users, false for registered users
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "isGuest" BOOLEAN NOT NULL DEFAULT false;

-- 6. Make password optional for guest users
-- Guest users don't have passwords
ALTER TABLE "User"
ALTER COLUMN password DROP NOT NULL;

-- 7. Add index on paymentMethod for faster filtering
CREATE INDEX IF NOT EXISTS "Order_paymentMethod_idx" ON "Order"("paymentMethod");

-- 8. Add index on createdAt for date range queries
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");

-- ============================================
-- Verification Queries
-- ============================================

-- Check Order table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'Order'
ORDER BY ordinal_position;

-- Check OrderItem table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'OrderItem'
ORDER BY ordinal_position;

-- Check User table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;

-- Success message
SELECT 'Migration completed successfully!' as message;
