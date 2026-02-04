-- Enforce one variant per color/size combination per product.
-- Run after cleaning any duplicate combinations that already exist.
CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_product_color_size_unique_idx"
ON "ProductVariant" (
  "productId",
  COALESCE(LOWER(color), ''),
  COALESCE(LOWER(size), '')
);
