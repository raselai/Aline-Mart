-- Aline Mart Database Seed Data
-- Run this in Supabase SQL Editor

-- Insert Brands
INSERT INTO "Brand" (id, name, slug, description, "createdAt") VALUES
('brand_rolex', 'Rolex', 'rolex', 'Swiss luxury watchmaker', NOW()),
('brand_gucci', 'Gucci', 'gucci', 'Italian luxury fashion house', NOW()),
('brand_prada', 'Prada', 'prada', 'Italian luxury fashion brand', NOW()),
('brand_louis-vuitton', 'Louis Vuitton', 'louis-vuitton', 'French luxury fashion house', NOW()),
('brand_hermes', 'Hermès', 'hermes', 'French luxury goods manufacturer', NOW()),
('brand_chanel', 'Chanel', 'chanel', 'French luxury fashion house', NOW()),
('brand_dior', 'Dior', 'dior', 'French luxury goods company', NOW()),
('brand_balenciaga', 'Balenciaga', 'balenciaga', 'Spanish luxury fashion house', NOW()),
('brand_versace', 'Versace', 'versace', 'Italian luxury fashion company', NOW()),
('brand_burberry', 'Burberry', 'burberry', 'British luxury fashion house', NOW()),
('brand_ralph-lauren', 'Ralph Lauren', 'ralph-lauren', 'American fashion company', NOW()),
('brand_tommy-hilfiger', 'Tommy Hilfiger', 'tommy-hilfiger', 'American premium clothing brand', NOW()),
('brand_hugo-boss', 'Hugo Boss', 'hugo-boss', 'German luxury fashion house', NOW()),
('brand_armani', 'Armani', 'armani', 'Italian luxury fashion house', NOW()),
('brand_cartier', 'Cartier', 'cartier', 'French luxury jewelry and watch manufacturer', NOW()),
('brand_omega', 'Omega', 'omega', 'Swiss luxury watchmaker', NOW()),
('brand_nike', 'Nike', 'nike', 'American athletic footwear and apparel', NOW()),
('brand_adidas', 'Adidas', 'adidas', 'German athletic apparel and footwear', NOW()),
('brand_zara', 'Zara', 'zara', 'Spanish fast fashion retailer', NOW()),
('brand_calvin-klein', 'Calvin Klein', 'calvin-klein', 'American fashion house', NOW()),
('brand_michael-kors', 'Michael Kors', 'michael-kors', 'American fashion designer brand', NOW()),
('brand_givenchy', 'Givenchy', 'givenchy', 'French luxury fashion house', NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert Categories
INSERT INTO "Category" (id, name, slug, "parentId") VALUES
('cat_men', 'Men', 'men', NULL),
('cat_women', 'Women', 'women', NULL),
('cat_accessories', 'Accessories', 'accessories', NULL),
('cat_watches', 'Watches', 'watches', NULL),
('cat_bags', 'Bags', 'bags', NULL),
('cat_shoes', 'Shoes', 'shoes', NULL),
('cat_clothing', 'Clothing', 'clothing', NULL)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Brands and Categories seeded successfully!' as message;
