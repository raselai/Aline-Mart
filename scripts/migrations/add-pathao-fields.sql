-- Pathao Courier Integration Fields
-- Run this migration to add Pathao tracking and location fields

-- Pathao tracking fields on Order
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "pathaoConsignmentId" TEXT,
  ADD COLUMN IF NOT EXISTS "pathaoDeliveryFee" DOUBLE PRECISION;

-- Pathao location IDs on Address (for accurate order booking)
ALTER TABLE "Address"
  ADD COLUMN IF NOT EXISTS "pathaoCityId" INTEGER,
  ADD COLUMN IF NOT EXISTS "pathaoZoneId" INTEGER,
  ADD COLUMN IF NOT EXISTS "pathaoAreaId" INTEGER;
