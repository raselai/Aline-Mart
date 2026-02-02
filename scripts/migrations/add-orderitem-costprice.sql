-- Add costPrice column to OrderItem table
-- This captures the product's cost price at the time of purchase for accurate profit tracking
ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "costPrice" DOUBLE PRECISION DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN "OrderItem"."costPrice" IS 'Product cost price captured at time of order creation for historical profit tracking';
