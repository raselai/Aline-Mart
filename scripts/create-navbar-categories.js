require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createNavbarCategories() {
  console.log('Creating/Updating Navbar Categories...\n');

  // Define the categories needed for navbar
  const navbarCategories = [
    {
      id: 'cat_men',
      name: 'Men',
      slug: 'men',
      parentId: null
    },
    {
      id: 'cat_women',
      name: 'Women',
      slug: 'women',
      parentId: null
    },
    {
      id: 'cat_kids',
      name: 'Kids',
      slug: 'kids',
      parentId: null
    },
    {
      id: 'cat_homeware',
      name: 'Homeware',
      slug: 'homeware',
      parentId: null
    },
    {
      id: 'cat_beauty',
      name: 'Beauty',
      slug: 'beauty',
      parentId: null
    },
    {
      id: 'cat_outlet',
      name: 'Outlet',
      slug: 'outlet',
      parentId: null
    },
    {
      id: 'cat_sports',
      name: 'Sports & Fitness',
      slug: 'sports',
      parentId: null
    },
  ];

  for (const category of navbarCategories) {
    try {
      // Check if category already exists
      const { data: existing } = await supabase
        .from('Category')
        .select('id, name')
        .eq('id', category.id)
        .single();

      if (existing) {
        // Update existing category
        const { error } = await supabase
          .from('Category')
          .update({
            name: category.name,
            slug: category.slug,
            parentId: category.parentId
          })
          .eq('id', category.id);

        if (error) {
          console.error(`❌ Error updating ${category.name}:`, error.message);
        } else {
          console.log(`✓ Updated: ${category.name}`);
        }
      } else {
        // Insert new category
        const { error } = await supabase
          .from('Category')
          .insert([category]);

        if (error) {
          console.error(`❌ Error creating ${category.name}:`, error.message);
        } else {
          console.log(`✓ Created: ${category.name}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${category.name}:`, error.message);
    }
  }

  console.log('\n✅ Navbar categories setup complete!\n');

  // Show final list of all categories
  const { data: allCategories } = await supabase
    .from('Category')
    .select('id, name, slug, parentId')
    .is('parentId', null)
    .order('name');

  console.log('Parent Categories in Database:');
  console.log('='.repeat(60));
  for (const cat of allCategories || []) {
    console.log(`${cat.name.padEnd(20)} → /categories/${cat.slug}`);
  }
  console.log('='.repeat(60));
}

createNavbarCategories();
