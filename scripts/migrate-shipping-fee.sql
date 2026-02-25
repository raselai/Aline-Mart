-- Migration: Split shippingFee into shippingFeeInsideDhaka and shippingFeeOutsideDhaka
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- Step 1: Add new numeric columns
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "shippingFeeInsideDhaka" NUMERIC DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS "shippingFeeOutsideDhaka" NUMERIC DEFAULT NULL;

-- Step 2: Migrate existing data — copy shippingFee to shippingFeeInsideDhaka where it's a valid number
UPDATE "Product"
SET "shippingFeeInsideDhaka" = "shippingFee"::NUMERIC
WHERE "shippingFee" IS NOT NULL
  AND "shippingFee" ~ '^\d+(\.\d+)?$';

-- Step 3: Drop the old column
ALTER TABLE "Product" DROP COLUMN IF EXISTS "shippingFee";
