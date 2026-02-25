-- Migration: Add 'featured' column to Category table
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)

ALTER TABLE "Category"
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;
