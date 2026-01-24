-- ============================================================================
-- Inventory Management Migration Script
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Enable UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. Add lowStockThreshold column to ProductVariant
-- ============================================================================
ALTER TABLE "ProductVariant"
  ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER DEFAULT 10;

-- Add comment for documentation
COMMENT ON COLUMN "ProductVariant"."lowStockThreshold" IS 'Threshold below which stock is considered low. Default: 10';

-- ============================================================================
-- 2. Create InventoryLog table for audit trail
-- ============================================================================
CREATE TABLE IF NOT EXISTS "InventoryLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "variantId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "previousStock" INTEGER NOT NULL,
  "newStock" INTEGER NOT NULL,
  "changeAmount" INTEGER NOT NULL,
  "changeType" TEXT NOT NULL,
  "reason" TEXT,
  "orderId" TEXT,
  "adminId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Foreign key constraints
  CONSTRAINT "InventoryLog_variantId_fkey"
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"(id) ON DELETE CASCADE,

  -- Validate changeType values
  CONSTRAINT "InventoryLog_changeType_check"
    CHECK ("changeType" IN (
      'SALE',
      'MANUAL_ADJUSTMENT',
      'RETURN',
      'DAMAGED',
      'RESTOCK',
      'CANCELLED_ORDER',
      'BULK_UPDATE'
    ))
);

-- Add comment for documentation
COMMENT ON TABLE "InventoryLog" IS 'Audit log for all inventory/stock changes';

-- ============================================================================
-- 3. Create indexes for efficient querying
-- ============================================================================
CREATE INDEX IF NOT EXISTS "InventoryLog_variantId_idx"
  ON "InventoryLog"("variantId");

CREATE INDEX IF NOT EXISTS "InventoryLog_productId_idx"
  ON "InventoryLog"("productId");

CREATE INDEX IF NOT EXISTS "InventoryLog_createdAt_idx"
  ON "InventoryLog"("createdAt" DESC);

CREATE INDEX IF NOT EXISTS "InventoryLog_changeType_idx"
  ON "InventoryLog"("changeType");

CREATE INDEX IF NOT EXISTS "InventoryLog_orderId_idx"
  ON "InventoryLog"("orderId");

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS "InventoryLog_variant_date_idx"
  ON "InventoryLog"("variantId", "createdAt" DESC);

-- ============================================================================
-- 4. Enable Row Level Security (RLS)
-- ============================================================================
ALTER TABLE "InventoryLog" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users (admin check in app layer)
CREATE POLICY "Allow all operations for authenticated users" ON "InventoryLog"
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 5. Add index on ProductVariant for low stock queries
-- ============================================================================
CREATE INDEX IF NOT EXISTS "ProductVariant_stock_idx"
  ON "ProductVariant"("stock");

CREATE INDEX IF NOT EXISTS "ProductVariant_lowStock_idx"
  ON "ProductVariant"("stock", "lowStockThreshold");

-- ============================================================================
-- Verification Queries (run after migration)
-- ============================================================================

-- Check InventoryLog table created
-- SELECT COUNT(*) as inventory_log_count FROM "InventoryLog";

-- Check lowStockThreshold column added
-- SELECT id, sku, stock, "lowStockThreshold" FROM "ProductVariant" LIMIT 5;

-- Check indexes created
-- SELECT indexname FROM pg_indexes WHERE tablename = 'InventoryLog';
-- SELECT indexname FROM pg_indexes WHERE tablename = 'ProductVariant' AND indexname LIKE '%stock%';

-- ============================================================================
-- Rollback Script (if needed)
-- ============================================================================
-- DROP TABLE IF EXISTS "InventoryLog" CASCADE;
-- ALTER TABLE "ProductVariant" DROP COLUMN IF EXISTS "lowStockThreshold";
