-- PayStation Payment Integration Migration
-- Adds payment-related fields to support PayStation and Cash on Delivery

-- Add payment fields to Order table
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT
    CHECK ("paymentMethod" IN ('PAYSTATION', 'COD')),
  ADD COLUMN IF NOT EXISTS "shippingCost" DOUBLE PRECISION DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "paystationTransactionId" TEXT;

-- Add guest user support to User table
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "isGuest" BOOLEAN DEFAULT false NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "Order_paystationTransactionId_idx"
  ON "Order"("paystationTransactionId");

CREATE INDEX IF NOT EXISTS "Order_paymentMethod_idx"
  ON "Order"("paymentMethod");

CREATE INDEX IF NOT EXISTS "User_isGuest_idx"
  ON "User"("isGuest");

CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx"
  ON "Order"("status", "createdAt" DESC);

-- Add comments for documentation
COMMENT ON COLUMN "Order"."paymentMethod" IS 'Payment method used: PAYSTATION (online) or COD (cash on delivery)';
COMMENT ON COLUMN "Order"."shippingCost" IS 'Shipping cost in BDT (৳50 for COD, ৳0 for PAYSTATION)';
COMMENT ON COLUMN "Order"."paystationTransactionId" IS 'PayStation transaction ID for verification and tracking';
COMMENT ON COLUMN "User"."isGuest" IS 'True if user created via guest checkout (no password)';
