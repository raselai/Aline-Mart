-- Add sub-order tracking fields to OrderItem table
-- subOrderNumber: unique identifier per item within an order (e.g. AM-XXXX-XXXX-1)
-- status: individual item lifecycle (ACTIVE, CANCELLED, RETURNED, REFUNDED)
-- itemCancellationReason: reason for cancelling this specific item
-- vendor: vendor name captured at order creation time for historical accuracy

ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "subOrderNumber" TEXT DEFAULT NULL;

ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'ACTIVE';

ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "itemCancellationReason" TEXT DEFAULT NULL;

ALTER TABLE "OrderItem"
ADD COLUMN IF NOT EXISTS "vendor" TEXT DEFAULT NULL;

-- Add index on subOrderNumber for quick lookups
CREATE INDEX IF NOT EXISTS idx_orderitem_subordernumber ON "OrderItem" ("subOrderNumber");

-- Add index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orderitem_status ON "OrderItem" ("status");
