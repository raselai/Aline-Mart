-- ============================================
-- Aline Mart - Accounts/Finance Management
-- Database Migration Script
-- ============================================
-- NOTE: Existing tables (Order, OrderItem, User, Product) use TEXT for id columns.
--       Vendor table uses UUID for id. New tables use TEXT for PKs (gen_random_uuid()::TEXT)
--       to stay consistent, and FK types match their referenced table's id type.

-- 1. Add commissionRate to Vendor table
ALTER TABLE "Vendor" ADD COLUMN IF NOT EXISTS "commissionRate" DECIMAL(5,2) DEFAULT 10.00;

-- 2. Add vendorId to Product table (link to Vendor by ID — Vendor.id is UUID)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "vendorId" UUID REFERENCES "Vendor"(id) ON DELETE SET NULL;

-- 3. Add COD collection and refund status to Order table
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "codCollectionStatus" VARCHAR(20) DEFAULT NULL;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "refundStatus" VARCHAR(20) DEFAULT NULL;

-- 4. Create Transaction table
CREATE TABLE IF NOT EXISTS "Transaction" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "type" VARCHAR(20) NOT NULL CHECK ("type" IN (
    'SALE', 'REFUND', 'COD_COLLECTION', 'VENDOR_PAYOUT', 'ADJUSTMENT'
  )),
  "amount" DECIMAL(12,2) NOT NULL,
  "orderId" TEXT REFERENCES "Order"(id) ON DELETE SET NULL,
  "refundId" TEXT,
  "vendorPayoutId" TEXT,
  "description" TEXT,
  "reference" VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "createdBy" TEXT REFERENCES "User"(id) ON DELETE SET NULL
);

-- 5. Create Refund table
CREATE TABLE IF NOT EXISTS "Refund" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "orderItemId" TEXT REFERENCES "OrderItem"(id) ON DELETE SET NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "reason" TEXT NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ("status" IN (
    'PENDING', 'PROCESSED', 'REJECTED'
  )),
  "type" VARCHAR(20) NOT NULL CHECK ("type" IN ('FULL', 'PARTIAL')),
  "restoreStock" BOOLEAN DEFAULT false,
  "processedAt" TIMESTAMP,
  "processedBy" TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 6. Create CODCollection table
CREATE TABLE IF NOT EXISTS "CODCollection" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"(id) ON DELETE CASCADE,
  "expectedAmount" DECIMAL(12,2) NOT NULL,
  "collectedAmount" DECIMAL(12,2),
  "collectedAt" TIMESTAMP,
  "collectedBy" TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ("status" IN (
    'PENDING', 'COLLECTED', 'PARTIAL', 'FAILED'
  )),
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 7. Create VendorPayout table
CREATE TABLE IF NOT EXISTS "VendorPayout" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "vendorId" UUID NOT NULL REFERENCES "Vendor"(id) ON DELETE CASCADE,
  "periodStart" DATE NOT NULL,
  "periodEnd" DATE NOT NULL,
  "totalSales" DECIMAL(12,2) NOT NULL,
  "commissionRate" DECIMAL(5,2) NOT NULL,
  "commissionAmount" DECIMAL(12,2) NOT NULL,
  "payoutAmount" DECIMAL(12,2) NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK ("status" IN (
    'PENDING', 'PAID'
  )),
  "paidAt" TIMESTAMP,
  "paidBy" TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  "reference" VARCHAR(255),
  "notes" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 8. Add foreign key references from Transaction to Refund and VendorPayout
-- (done after tables are created to avoid circular dependency)
ALTER TABLE "Transaction"
  ADD CONSTRAINT "Transaction_refundId_fkey"
  FOREIGN KEY ("refundId") REFERENCES "Refund"(id) ON DELETE SET NULL;

ALTER TABLE "Transaction"
  ADD CONSTRAINT "Transaction_vendorPayoutId_fkey"
  FOREIGN KEY ("vendorPayoutId") REFERENCES "VendorPayout"(id) ON DELETE SET NULL;

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_transaction_type" ON "Transaction"("type");
CREATE INDEX IF NOT EXISTS "idx_transaction_orderId" ON "Transaction"("orderId");
CREATE INDEX IF NOT EXISTS "idx_transaction_createdAt" ON "Transaction"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_refund_orderId" ON "Refund"("orderId");
CREATE INDEX IF NOT EXISTS "idx_refund_status" ON "Refund"("status");
CREATE INDEX IF NOT EXISTS "idx_codcollection_orderId" ON "CODCollection"("orderId");
CREATE INDEX IF NOT EXISTS "idx_codcollection_status" ON "CODCollection"("status");
CREATE INDEX IF NOT EXISTS "idx_vendorpayout_vendorId" ON "VendorPayout"("vendorId");
CREATE INDEX IF NOT EXISTS "idx_vendorpayout_status" ON "VendorPayout"("status");
CREATE INDEX IF NOT EXISTS "idx_product_vendorId" ON "Product"("vendorId");
CREATE INDEX IF NOT EXISTS "idx_order_codCollectionStatus" ON "Order"("codCollectionStatus");
CREATE INDEX IF NOT EXISTS "idx_order_refundStatus" ON "Order"("refundStatus");
