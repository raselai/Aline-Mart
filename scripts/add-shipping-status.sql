-- Migration: Add shippingStatus column and update order statuses
-- Run this in your Supabase SQL Editor

-- 1. Drop the existing CHECK constraint on status column
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_status_check";

-- 2. Add shippingStatus column with default 'PROCESSING'
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "shippingStatus" TEXT NOT NULL DEFAULT 'PROCESSING';

-- 3. Map old order statuses to new system
-- Order: SHIPPED -> CONFIRM, shipping: ON_THE_WAY
UPDATE "Order" SET
  "shippingStatus" = 'ON_THE_WAY',
  "status" = 'CONFIRM'
WHERE "status" = 'SHIPPED';

-- Order: DELIVERED stays DELIVERED, shipping: DELIVERED
UPDATE "Order" SET
  "shippingStatus" = 'DELIVERED'
WHERE "status" = 'DELIVERED';

-- Order: CANCELLED -> CANCEL
UPDATE "Order" SET
  "status" = 'CANCEL'
WHERE "status" = 'CANCELLED';

-- Order: PROCESSING -> PENDING
UPDATE "Order" SET
  "status" = 'PENDING'
WHERE "status" = 'PROCESSING';

-- 4. Add new CHECK constraints for both columns
ALTER TABLE "Order"
ADD CONSTRAINT "Order_status_check"
CHECK ("status" IN ('NEW', 'PENDING', 'CONFIRM', 'CANCEL', 'RETURN', 'REFUND', 'PARTIAL_CONFIRMED', 'DELIVERED', 'RETURN_TO_VENDOR'));

ALTER TABLE "Order"
ADD CONSTRAINT "Order_shippingStatus_check"
CHECK ("shippingStatus" IN ('PROCESSING', 'READY_TO_DISPATCH', 'IN_DESTINATION', 'ON_THE_WAY', 'DELIVERED', 'CANCEL', 'RETURN'));

-- 5. Verify the migration
SELECT "status", "shippingStatus", COUNT(*) as count
FROM "Order"
GROUP BY "status", "shippingStatus"
ORDER BY "status";
