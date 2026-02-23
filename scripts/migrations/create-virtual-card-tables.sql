-- Virtual Card System Tables
-- Run this migration against Supabase to create the virtual card system

-- 1. VirtualCard table — one per user
CREATE TABLE IF NOT EXISTS "VirtualCard" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE,
  "cardNumber" VARCHAR(19) NOT NULL UNIQUE,
  "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "lifetimeLoaded" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "tierLevel" VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
  "discountPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. VirtualCardTransaction table — ledger of all card activity
CREATE TABLE IF NOT EXISTS "VirtualCardTransaction" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "cardId" TEXT NOT NULL REFERENCES "VirtualCard"(id) ON DELETE CASCADE,
  "type" VARCHAR(20) NOT NULL CHECK ("type" IN ('TOPUP', 'SPEND', 'REFUND_CREDIT')),
  "amount" DECIMAL(12,2) NOT NULL,
  "balanceAfter" DECIMAL(12,2) NOT NULL,
  "orderId" TEXT REFERENCES "Order"(id) ON DELETE SET NULL,
  "paystationTrxId" VARCHAR(100),
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS "idx_virtual_card_userId" ON "VirtualCard"("userId");
CREATE INDEX IF NOT EXISTS "idx_virtual_card_transaction_cardId" ON "VirtualCardTransaction"("cardId");
CREATE INDEX IF NOT EXISTS "idx_virtual_card_transaction_createdAt" ON "VirtualCardTransaction"("createdAt" DESC);

-- 4. Atomic balance deduction function (prevents race conditions via row-level lock)
CREATE OR REPLACE FUNCTION deduct_virtual_card_balance(card_id TEXT, deduct_amount DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  -- Lock the row to prevent concurrent deductions
  SELECT "balance" INTO current_balance
  FROM "VirtualCard"
  WHERE "id" = card_id
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Virtual card not found: %', card_id;
  END IF;

  IF current_balance < deduct_amount THEN
    RAISE EXCEPTION 'Insufficient balance. Available: %, Requested: %', current_balance, deduct_amount;
  END IF;

  UPDATE "VirtualCard"
  SET "balance" = "balance" - deduct_amount,
      "updatedAt" = NOW()
  WHERE "id" = card_id;

  RETURN current_balance - deduct_amount;
END;
$$ LANGUAGE plpgsql;

-- 5. Seed default tier configuration in settings table (JSONB column)
INSERT INTO settings (key, value)
VALUES (
  'virtual_card_tiers',
  '[{"name":"STANDARD","minLifetimeLoad":0,"discountPercent":0},{"name":"SILVER","minLifetimeLoad":5000,"discountPercent":3},{"name":"GOLD","minLifetimeLoad":15000,"discountPercent":5},{"name":"PLATINUM","minLifetimeLoad":50000,"discountPercent":8}]'::jsonb
)
ON CONFLICT (key) DO NOTHING;
