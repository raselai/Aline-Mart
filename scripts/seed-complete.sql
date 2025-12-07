-- ============================================
-- Aline Mart Complete Database Seed
-- Run this in Supabase SQL Editor
-- ============================================

-- Clear existing data (optional - uncomment if you want fresh start)
-- DELETE FROM "ProductImage";
-- DELETE FROM "ProductVariant";
-- DELETE FROM "Product";
-- DELETE FROM "Category";
-- DELETE FROM "Brand";

-- ============================================
-- Insert Brands (22 luxury brands)
-- ============================================
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

-- ============================================
-- Insert Categories
-- ============================================
INSERT INTO "Category" (id, name, slug, "parentId") VALUES
('cat_men', 'Men', 'men', NULL),
('cat_women', 'Women', 'women', NULL),
('cat_accessories', 'Accessories', 'accessories', NULL),
('cat_watches', 'Watches', 'watches', NULL),
('cat_bags', 'Bags', 'bags', NULL),
('cat_shoes', 'Shoes', 'shoes', NULL),
('cat_clothing', 'Clothing', 'clothing', NULL)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Insert Products (30+ products)
-- ============================================

-- Rolex Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_rolex-submariner', 'Submariner Date', 'rolex-submariner-date', 'The Rolex Submariner Date is a legendary diving watch with a date function. Features a robust Oyster case, unidirectional rotatable bezel, and Chromalight display.', 14300, NULL, 'brand_rolex', 'cat_watches', true, false, true, NOW(), NOW()),
('prod_rolex-datejust', 'Datejust 41', 'rolex-datejust-41', 'The Rolex Datejust 41 is an iconic timepiece combining classic design with modern proportions. Features a fluted bezel and Jubilee bracelet.', 11900, NULL, 'brand_rolex', 'cat_watches', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Gucci Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_gucci-marmont', 'GG Marmont Matelassé Shoulder Bag', 'gucci-gg-marmont-shoulder-bag', 'Iconic shoulder bag in matelassé chevron leather with a vintage feel. Features the Double G hardware and chain strap.', 2890, 2490, 'brand_gucci', 'cat_bags', true, false, true, NOW(), NOW()),
('prod_gucci-ace', 'Ace Embroidered Sneaker', 'gucci-ace-embroidered-sneaker', 'Low-top sneaker in leather with iconic green and red Web stripe and embroidered details.', 790, NULL, 'brand_gucci', 'cat_shoes', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Louis Vuitton Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_lv-neverfull', 'Neverfull MM Monogram', 'lv-neverfull-mm-monogram', 'The iconic Neverfull tote in Monogram canvas. Spacious and practical with side laces for adjustable shape.', 2030, NULL, 'brand_louis-vuitton', 'cat_bags', true, false, true, NOW(), NOW()),
('prod_lv-trainer', 'LV Trainer Sneaker', 'lv-trainer-sneaker', 'Luxury sneaker crafted from premium materials with Louis Vuitton signature details.', 1340, NULL, 'brand_louis-vuitton', 'cat_shoes', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Hermès Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_hermes-birkin', 'Birkin 30', 'hermes-birkin-30', 'The legendary Hermès Birkin bag in Togo leather. Handcrafted with palladium hardware.', 18500, NULL, 'brand_hermes', 'cat_bags', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Chanel Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_chanel-flap', 'Classic Flap Bag Medium', 'chanel-classic-flap-medium', 'Timeless quilted lambskin flap bag with iconic chain strap and double C turn-lock closure.', 9200, 8500, 'brand_chanel', 'cat_bags', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Prada Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_prada-galleria', 'Galleria Saffiano Leather Bag', 'prada-galleria-saffiano', 'Elegant structured bag in iconic Saffiano leather with double handles and detachable shoulder strap.', 3200, NULL, 'brand_prada', 'cat_bags', false, false, true, NOW(), NOW()),
('prod_prada-cloudbust', 'Cloudbust Thunder Sneakers', 'prada-cloudbust-thunder', 'Futuristic sneakers with oversized design and technical fabric uppers.', 890, NULL, 'brand_prada', 'cat_shoes', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Balenciaga Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_balenciaga-triple-s', 'Triple S Sneaker', 'balenciaga-triple-s', 'Chunky multi-layered sole sneaker combining running, basketball, and track shoe styles.', 1090, NULL, 'brand_balenciaga', 'cat_shoes', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Versace Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_versace-medusa', 'Medusa Aevitas Platform Pumps', 'versace-medusa-aevitas', 'Signature platform pumps with Medusa hardware and bold design.', 1325, NULL, 'brand_versace', 'cat_shoes', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Burberry Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_burberry-trench', 'Heritage Trench Coat', 'burberry-heritage-trench', 'Iconic trench coat in gabardine with classic check lining and belt.', 2390, NULL, 'brand_burberry', 'cat_clothing', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Cartier Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_cartier-love', 'Love Bracelet', 'cartier-love-bracelet', 'Iconic oval bracelet in 18K gold with screw motif. Comes with screwdriver.', 7050, NULL, 'brand_cartier', 'cat_accessories', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Omega Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_omega-speedmaster', 'Speedmaster Professional Moonwatch', 'omega-speedmaster-moonwatch', 'Legendary chronograph watch worn on the moon. Features hesalite crystal and manual movement.', 6600, NULL, 'brand_omega', 'cat_watches', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Nike Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_nike-jordan1', 'Air Jordan 1 Retro High', 'nike-air-jordan-1-retro', 'Classic basketball sneaker with iconic silhouette and premium leather construction.', 170, NULL, 'brand_nike', 'cat_shoes', true, true, true, NOW(), NOW()),
('prod_nike-airmax90', 'Air Max 90', 'nike-air-max-90', 'Iconic running shoe with visible Air unit and waffle outsole.', 130, NULL, 'brand_nike', 'cat_shoes', false, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Adidas Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_adidas-stansmith', 'Stan Smith Sneakers', 'adidas-stan-smith', 'Clean minimalist tennis sneakers in premium leather with perforated 3-Stripes.', 90, NULL, 'brand_adidas', 'cat_shoes', false, false, true, NOW(), NOW()),
('prod_adidas-ultraboost', 'Ultraboost 22', 'adidas-ultraboost-22', 'Performance running shoe with Boost cushioning and Primeknit upper.', 190, NULL, 'brand_adidas', 'cat_shoes', true, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Ralph Lauren Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_rl-polo', 'Classic Fit Polo Shirt', 'ralph-lauren-classic-polo', 'Timeless polo shirt in soft cotton mesh with signature pony logo.', 98, NULL, 'brand_ralph-lauren', 'cat_clothing', false, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Armani Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_armani-suit', 'Slim Fit Suit', 'armani-slim-fit-suit', 'Elegant two-piece suit in fine wool with modern slim fit.', 1895, NULL, 'brand_armani', 'cat_clothing', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Hugo Boss Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_hugoboss-watch', 'The Grand Chronograph', 'hugo-boss-grand-chronograph', 'Sophisticated chronograph watch with stainless steel case and leather strap.', 395, NULL, 'brand_hugo-boss', 'cat_watches', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Calvin Klein Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_ck-bralette', 'Modern Cotton Bralette', 'calvin-klein-modern-cotton-bralette', 'Comfortable bralette in signature cotton stretch with logo elastic band.', 35, NULL, 'brand_calvin-klein', 'cat_clothing', false, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Michael Kors Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_mk-jetset', 'Jet Set Travel Tote', 'michael-kors-jet-set-tote', 'Spacious tote in Saffiano leather with gold-tone hardware and multiple pockets.', 298, NULL, 'brand_michael-kors', 'cat_bags', false, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Dior Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_dior-ladydior', 'Lady Dior Medium Bag', 'dior-lady-dior-medium', 'Iconic bag in Cannage lambskin with Dior charms and top handles.', 5500, NULL, 'brand_dior', 'cat_bags', true, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Givenchy Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_givenchy-antigona', 'Antigona Medium Bag', 'givenchy-antigona-medium', 'Structured bag in grained leather with signature metal details.', 2890, NULL, 'brand_givenchy', 'cat_bags', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Tommy Hilfiger Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_th-sweater', 'Signature Stripe Sweater', 'tommy-hilfiger-stripe-sweater', 'Classic crew neck sweater with iconic flag stripe detail.', 129, NULL, 'brand_tommy-hilfiger', 'cat_clothing', false, false, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Zara Products
INSERT INTO "Product" (id, name, slug, description, price, "salePrice", "brandId", "categoryId", featured, "isNew", "inStock", "createdAt", "updatedAt") VALUES
('prod_zara-blazer', 'Tailored Blazer', 'zara-tailored-blazer', 'Contemporary tailored blazer with structured shoulders and button closure.', 89, NULL, 'brand_zara', 'cat_clothing', false, true, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Insert Product Images
-- ============================================
INSERT INTO "ProductImage" (id, url, alt, "order", "productId") VALUES
-- Rolex Submariner
('img_rolex-sub-1', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=1000&fit=crop', 'Rolex Submariner front view', 0, 'prod_rolex-submariner'),
('img_rolex-sub-2', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=1000&fit=crop', 'Rolex Submariner side view', 1, 'prod_rolex-submariner'),

-- Rolex Datejust
('img_rolex-date-1', 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&h=1000&fit=crop', 'Rolex Datejust', 0, 'prod_rolex-datejust'),

-- Gucci Marmont
('img_gucci-mar-1', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop', 'Gucci Marmont bag', 0, 'prod_gucci-marmont'),
('img_gucci-mar-2', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop', 'Gucci Marmont detail', 1, 'prod_gucci-marmont'),

-- Gucci Ace
('img_gucci-ace-1', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=1000&fit=crop', 'Gucci Ace sneaker', 0, 'prod_gucci-ace'),

-- LV Neverfull
('img_lv-never-1', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop', 'LV Neverfull', 0, 'prod_lv-neverfull'),

-- Nike Jordan 1
('img_nike-j1-1', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop', 'Air Jordan 1', 0, 'prod_nike-jordan1'),

-- Adidas Ultraboost
('img_adidas-ub-1', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=1000&fit=crop', 'Adidas Ultraboost', 0, 'prod_adidas-ultraboost')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Insert Product Variants
-- ============================================
INSERT INTO "ProductVariant" (id, "productId", color, size, sku, stock, "priceModifier") VALUES
-- Rolex Submariner
('var_ROL-SUB-BLK-001', 'prod_rolex-submariner', 'Black', 'One Size', 'ROL-SUB-BLK-001', 5, 0),

-- Rolex Datejust
('var_ROL-DAT-SLV-001', 'prod_rolex-datejust', 'Silver', 'One Size', 'ROL-DAT-SLV-001', 8, 0),

-- Gucci Marmont
('var_GUC-MAR-BLK-M', 'prod_gucci-marmont', 'Black', 'Medium', 'GUC-MAR-BLK-M', 12, 0),
('var_GUC-MAR-RED-M', 'prod_gucci-marmont', 'Red', 'Medium', 'GUC-MAR-RED-M', 8, 0),

-- Gucci Ace
('var_GUC-ACE-WHT-8', 'prod_gucci-ace', 'White', 'US 8', 'GUC-ACE-WHT-8', 15, 0),
('var_GUC-ACE-WHT-9', 'prod_gucci-ace', 'White', 'US 9', 'GUC-ACE-WHT-9', 20, 0),
('var_GUC-ACE-WHT-10', 'prod_gucci-ace', 'White', 'US 10', 'GUC-ACE-WHT-10', 18, 0),

-- LV Neverfull
('var_LV-NEV-MON-MM', 'prod_lv-neverfull', 'Monogram', 'MM', 'LV-NEV-MON-MM', 10, 0),

-- LV Trainer
('var_LV-TRN-WHB-9', 'prod_lv-trainer', 'White/Blue', 'US 9', 'LV-TRN-WHB-9', 7, 0),
('var_LV-TRN-WHB-10', 'prod_lv-trainer', 'White/Blue', 'US 10', 'LV-TRN-WHB-10', 5, 0),

-- Hermès Birkin
('var_HER-BIR-BLK-30', 'prod_hermes-birkin', 'Black', '30cm', 'HER-BIR-BLK-30', 2, 0),
('var_HER-BIR-ETO-30', 'prod_hermes-birkin', 'Etoupe', '30cm', 'HER-BIR-ETO-30', 1, 0),

-- Chanel Flap
('var_CHA-FLA-BLK-M', 'prod_chanel-flap', 'Black', 'Medium', 'CHA-FLA-BLK-M', 6, 0),
('var_CHA-FLA-BEI-M', 'prod_chanel-flap', 'Beige', 'Medium', 'CHA-FLA-BEI-M', 4, 0),

-- Nike Jordan 1
('var_NIK-AJ1-CHI-9', 'prod_nike-jordan1', 'Chicago', 'US 9', 'NIK-AJ1-CHI-9', 25, 0),
('var_NIK-AJ1-CHI-10', 'prod_nike-jordan1', 'Chicago', 'US 10', 'NIK-AJ1-CHI-10', 30, 0),
('var_NIK-AJ1-CHI-11', 'prod_nike-jordan1', 'Chicago', 'US 11', 'NIK-AJ1-CHI-11', 22, 0),

-- Adidas Ultraboost
('var_ADI-ULT-BLK-9', 'prod_adidas-ultraboost', 'Black', 'US 9', 'ADI-ULT-BLK-9', 28, 0),
('var_ADI-ULT-WHT-9', 'prod_adidas-ultraboost', 'White', 'US 9', 'ADI-ULT-WHT-9', 32, 0)
ON CONFLICT (sku) DO NOTHING;

-- ============================================
-- Success Message
-- ============================================
SELECT
    (SELECT COUNT(*) FROM "Brand") as brands_count,
    (SELECT COUNT(*) FROM "Category") as categories_count,
    (SELECT COUNT(*) FROM "Product") as products_count,
    (SELECT COUNT(*) FROM "ProductImage") as images_count,
    (SELECT COUNT(*) FROM "ProductVariant") as variants_count,
    '✅ Database seeded successfully!' as message;
