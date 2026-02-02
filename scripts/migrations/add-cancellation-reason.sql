-- Add cancellationReason column to Order table
-- Stores the admin's reason when an order is cancelled
ALTER TABLE "Order"
ADD COLUMN IF NOT EXISTS "cancellationReason" TEXT DEFAULT NULL;
