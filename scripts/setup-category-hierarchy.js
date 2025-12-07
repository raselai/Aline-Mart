require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupCategoryHierarchy() {
  console.log('Setting up hierarchical category structure...\n');

  try {
    // Step 1: Get existing categories
    const { data: categories } = await supabase
      .from('Category')
      .select('*')
      .order('name');

    console.log('Current categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (id: ${cat.id}, parentId: ${cat.parentId})`);
    });

    // Find parent categories
    const menCategory = categories.find(c => c.slug === 'men');
    const womenCategory = categories.find(c => c.slug === 'women');
    const kidsCategory = categories.find(c => c.slug === 'kids');

    // Find subcategories
    const watchesCategory = categories.find(c => c.slug === 'watches');
    const bagsCategory = categories.find(c => c.slug === 'bags');
    const shoesCategory = categories.find(c => c.slug === 'shoes');
    const clothingCategory = categories.find(c => c.slug === 'clothing');
    const accessoriesCategory = categories.find(c => c.slug === 'accessories');

    console.log('\n--- Setting up hierarchy ---\n');

    // Step 2: Create Men's subcategories (if they don't exist)
    const menSubcategories = [
      { id: 'cat_mens-watches', name: "Men's Watches", slug: 'mens-watches', parentId: menCategory?.id },
      { id: 'cat_mens-bags', name: "Men's Bags", slug: 'mens-bags', parentId: menCategory?.id },
      { id: 'cat_mens-shoes', name: "Men's Shoes", slug: 'mens-shoes', parentId: menCategory?.id },
      { id: 'cat_mens-clothing', name: "Men's Clothing", slug: 'mens-clothing', parentId: menCategory?.id },
      { id: 'cat_mens-accessories', name: "Men's Accessories", slug: 'mens-accessories', parentId: menCategory?.id },
    ];

    // Step 3: Create Women's subcategories
    const womenSubcategories = [
      { id: 'cat_womens-watches', name: "Women's Watches", slug: 'womens-watches', parentId: womenCategory?.id },
      { id: 'cat_womens-bags', name: "Women's Bags", slug: 'womens-bags', parentId: womenCategory?.id },
      { id: 'cat_womens-shoes', name: "Women's Shoes", slug: 'womens-shoes', parentId: womenCategory?.id },
      { id: 'cat_womens-clothing', name: "Women's Clothing", slug: 'womens-clothing', parentId: womenCategory?.id },
      { id: 'cat_womens-accessories', name: "Women's Accessories", slug: 'womens-accessories', parentId: womenCategory?.id },
    ];

    // Step 4: Create Kids subcategories
    const kidsSubcategories = [
      { id: 'cat_kids-shoes', name: "Kids' Shoes", slug: 'kids-shoes', parentId: kidsCategory?.id },
      { id: 'cat_kids-clothing', name: "Kids' Clothing", slug: 'kids-clothing', parentId: kidsCategory?.id },
      { id: 'cat_kids-accessories', name: "Kids' Accessories", slug: 'kids-accessories', parentId: kidsCategory?.id },
    ];

    // Insert new subcategories
    const allSubcategories = [...menSubcategories, ...womenSubcategories, ...kidsSubcategories];

    for (const subcat of allSubcategories) {
      if (!subcat.parentId) continue; // Skip if parent doesn't exist

      // Check if already exists
      const { data: existing } = await supabase
        .from('Category')
        .select('id')
        .eq('slug', subcat.slug)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('Category')
          .insert([subcat]);

        if (error) {
          console.error(`Error creating ${subcat.name}:`, error.message);
        } else {
          console.log(`✓ Created: ${subcat.name}`);
        }
      } else {
        console.log(`- Already exists: ${subcat.name}`);
      }
    }

    console.log('\n✅ Category hierarchy setup complete!\n');

    // Step 5: Show the final structure
    const { data: allCategories } = await supabase
      .from('Category')
      .select('*')
      .order('name');

    console.log('Final category structure:');
    const parentCategories = allCategories.filter(c => !c.parentId);

    for (const parent of parentCategories) {
      const children = allCategories.filter(c => c.parentId === parent.id);
      console.log(`\n${parent.name} (${parent.slug})`);
      children.forEach(child => {
        console.log(`  └─ ${child.name} (${child.slug})`);
      });
    }

    console.log('\n📝 Next steps:');
    console.log('  1. Manually assign products to the appropriate subcategories (mens-watches, womens-bags, etc.)');
    console.log('  2. The category pages will show products from subcategories when viewing parent categories');

  } catch (error) {
    console.error('Error:', error);
  }
}

setupCategoryHierarchy();
