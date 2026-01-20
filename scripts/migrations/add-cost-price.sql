-- Migration: Add costPrice field to Product table
-- Date: 2026-01-20
-- Description: Adds cost price field for tracking wholesale/cost price of products

-- Add costPrice column to Product table
ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "costPrice" DECIMAL(10, 2) DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN "Product"."costPrice" IS 'Wholesale/cost price of the product for profit calculation';
