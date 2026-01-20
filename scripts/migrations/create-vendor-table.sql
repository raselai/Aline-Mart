-- Migration: Create Vendor table
-- Date: 2026-01-20
-- Description: Creates the Vendor table for managing vendor/supplier information

-- Create Vendor table
CREATE TABLE IF NOT EXISTS "Vendor" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  "shopName" VARCHAR(255) NOT NULL,
  "ownerName" VARCHAR(255) NOT NULL,
  "mobile" VARCHAR(20) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "businessType" VARCHAR(20) NOT NULL DEFAULT 'INDIVIDUAL' CHECK ("businessType" IN ('INDIVIDUAL', 'COMPANY')),

  -- Identity Documents
  "nationalId" VARCHAR(50),
  "tinNumber" VARCHAR(50),

  -- Addresses
  "pickupAddress" TEXT NOT NULL,
  "returnAddress" TEXT,

  -- Status
  "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK ("status" IN ('ACTIVE', 'INACTIVE')),
  "onboardingDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Payment Information - Bank
  "bankName" VARCHAR(255),
  "bankBranch" VARCHAR(255),
  "accountHolderName" VARCHAR(255),
  "accountNumber" VARCHAR(50),
  "routingNumber" VARCHAR(50),

  -- Payment Information - Mobile Banking
  "mobileBanking" JSONB DEFAULT '{}',
  -- Example: {"bkash": "01712345678", "nagad": "01812345678", "rocket": "01912345678"}

  -- Notes
  "notes" TEXT,

  -- Timestamps
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS "idx_vendor_shop_name" ON "Vendor" ("shopName");
CREATE INDEX IF NOT EXISTS "idx_vendor_email" ON "Vendor" ("email");
CREATE INDEX IF NOT EXISTS "idx_vendor_status" ON "Vendor" ("status");
CREATE INDEX IF NOT EXISTS "idx_vendor_business_type" ON "Vendor" ("businessType");

-- Add comment for documentation
COMMENT ON TABLE "Vendor" IS 'Stores vendor/supplier information for the marketplace';
COMMENT ON COLUMN "Vendor"."mobileBanking" IS 'JSON object containing mobile banking numbers: {bkash, nagad, rocket}';
