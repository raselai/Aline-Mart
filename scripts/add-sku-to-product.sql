-- Add SKU column to Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sku" TEXT;
