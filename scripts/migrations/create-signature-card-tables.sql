-- Signature Card System Migration
-- Run this in the Supabase SQL editor

-- ============================================================
-- 1. Create SignatureCard table
-- ============================================================
CREATE TABLE IF NOT EXISTS "SignatureCard" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "category" TEXT NOT NULL CHECK ("category" IN ('CROWN', 'PRIVILEGE', 'CAMPUS')),
  "cardNumber" TEXT NOT NULL UNIQUE,
  "cardholderName" TEXT NOT NULL,
  "balance" NUMERIC(12,2) NOT NULL DEFAULT 0,
  "purchasePrice" NUMERIC(12,2) NOT NULL,
  "validFrom" TIMESTAMPTZ,
  "validUntil" TIMESTAMPTZ,
  "isActive" BOOLEAN NOT NULL DEFAULT FALSE,
  "paystationTrxId" TEXT,
  "mailingAddress" TEXT NOT NULL,
  "physicalCardStatus" TEXT NOT NULL DEFAULT 'PENDING' CHECK ("physicalCardStatus" IN ('PENDING', 'SHIPPED', 'DELIVERED')),
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "dateOfBirth" DATE,
  "weddingAnniversary" DATE,
  "perCardOffers" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_signaturecard_userid" ON "SignatureCard"("userId");
CREATE INDEX IF NOT EXISTS "idx_signaturecard_cardnumber" ON "SignatureCard"("cardNumber");
CREATE INDEX IF NOT EXISTS "idx_signaturecard_category" ON "SignatureCard"("category");

-- ============================================================
-- 2. Create CardTransaction table
-- ============================================================
CREATE TABLE IF NOT EXISTS "CardTransaction" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "cardId" UUID NOT NULL REFERENCES "SignatureCard"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL CHECK ("type" IN ('PURCHASE', 'SPEND', 'DISCOUNT_USED', 'REFUND_CREDIT')),
  "amount" NUMERIC(12,2) NOT NULL,
  "balanceAfter" NUMERIC(12,2) NOT NULL,
  "orderId" UUID,
  "paystationTrxId" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_cardtransaction_cardid" ON "CardTransaction"("cardId");
CREATE INDEX IF NOT EXISTS "idx_cardtransaction_orderid" ON "CardTransaction"("orderId");

-- ============================================================
-- 3. Create CardOTP table
-- ============================================================
CREATE TABLE IF NOT EXISTS "CardOTP" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "cardId" UUID NOT NULL REFERENCES "SignatureCard"("id") ON DELETE CASCADE,
  "otpCode" TEXT NOT NULL,
  "expiresAt" TIMESTAMPTZ NOT NULL,
  "usedAt" TIMESTAMPTZ,
  "attempts" INT NOT NULL DEFAULT 0,
  "usedForOrderId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_cardotp_cardid" ON "CardOTP"("cardId");

-- ============================================================
-- 4. Atomic balance deduction function
-- ============================================================
CREATE OR REPLACE FUNCTION deduct_signature_card_balance(
  card_id UUID,
  deduct_amount NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  current_balance NUMERIC;
  card_active BOOLEAN;
  card_expiry TIMESTAMPTZ;
BEGIN
  -- Lock the row for update
  SELECT "balance", "isActive", "validUntil"
  INTO current_balance, card_active, card_expiry
  FROM "SignatureCard"
  WHERE "id" = card_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Signature card not found';
  END IF;

  IF NOT card_active THEN
    RAISE EXCEPTION 'Signature card is not active';
  END IF;

  IF card_expiry IS NOT NULL AND card_expiry < NOW() THEN
    RAISE EXCEPTION 'Signature card has expired';
  END IF;

  IF current_balance < deduct_amount THEN
    RAISE EXCEPTION 'Insufficient balance. Available: %, Required: %', current_balance, deduct_amount;
  END IF;

  UPDATE "SignatureCard"
  SET "balance" = "balance" - deduct_amount,
      "updatedAt" = NOW()
  WHERE "id" = card_id;

  RETURN current_balance - deduct_amount;
END;
$$;

-- ============================================================
-- 5. Rename old virtual card tables (deprecate)
-- ============================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'VirtualCard') THEN
    ALTER TABLE "VirtualCard" RENAME TO "VirtualCard_deprecated";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'VirtualCardTransaction') THEN
    ALTER TABLE "VirtualCardTransaction" RENAME TO "VirtualCardTransaction_deprecated";
  END IF;
END $$;

-- Drop old function
DROP FUNCTION IF EXISTS deduct_virtual_card_balance(UUID, NUMERIC);

-- ============================================================
-- 6. Seed "Aline Fashion" brand
-- ============================================================
INSERT INTO "Brand" ("id", "name", "slug", "description")
VALUES (gen_random_uuid(), 'Aline Fashion', 'aline-fashion', 'Aline Mart''s exclusive fashion brand')
ON CONFLICT ("slug") DO NOTHING;

-- ============================================================
-- 7. Seed settings
-- ============================================================

-- Aline Fashion brand ID setting
INSERT INTO "settings" ("key", "value")
SELECT 'aline_fashion_brand_id', to_jsonb((SELECT "id" FROM "Brand" WHERE "slug" = 'aline-fashion' LIMIT 1))
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";

-- Signature card types config
INSERT INTO "settings" ("key", "value")
VALUES (
  'signature_card_types',
  '[
    {
      "category": "CROWN",
      "price": 100000,
      "label": "Signature Crown",
      "description": "Elite Privilege Membership",
      "alineFashionDiscount": 40,
      "otherBrandsDiscount": 15,
      "freeDelivery": true,
      "birthdayBonus": 10
    },
    {
      "category": "PRIVILEGE",
      "price": 10000,
      "label": "Signature Privilege",
      "description": "Premium membership for the discerning shopper",
      "alineFashionDiscount": 30,
      "otherBrandsDiscount": 10,
      "freeDelivery": false,
      "birthdayBonus": 10
    },
    {
      "category": "CAMPUS",
      "price": 5000,
      "label": "Signature Campus Friendly",
      "description": "Exclusive student membership",
      "alineFashionDiscount": 30,
      "otherBrandsDiscount": 10,
      "freeDelivery": false,
      "birthdayBonus": 10
    }
  ]'::jsonb
)
ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
