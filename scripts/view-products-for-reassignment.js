require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function viewProducts() {
  console.log('Current Products and their Categories:\n');
  console.log('='.repeat(80));

  const { data: products } = await supabase
    .from('Product')
    .select(`
      id,
      name,
      categoryId,
      category:Category!Product_categoryId_fkey (
        id,
        name,
        slug
      )
    `)
    .order('name');

  // Group products by current category
  const productsByCategory = {};

  for (const product of products || []) {
    const category = Array.isArray(product.category) ? product.category[0] : product.category;
    const categoryName = category?.name || 'Uncategorized';

    if (!productsByCategory[categoryName]) {
      productsByCategory[categoryName] = [];
    }

    productsByCategory[categoryName].push({
      id: product.id,
      name: product.name,
      currentCategoryId: product.categoryId
    });
  }

  // Display products grouped by category
  for (const [categoryName, items] of Object.entries(productsByCategory)) {
    console.log(`\n📦 ${categoryName} (${items.length} products):`);
    items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}`);
      console.log(`      ID: ${item.id}`);
      console.log(`      Current Category ID: ${item.currentCategoryId}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📋 Available Categories for Reassignment:\n');

  const { data: categories } = await supabase
    .from('Category')
    .select('*')
    .order('name');

  // Group categories by parent
  const parentCategories = categories.filter(c => !c.parentId);
  const subcategories = categories.filter(c => c.parentId);

  console.log('Parent Categories:');
  parentCategories.forEach(cat => {
    const children = subcategories.filter(sub => sub.parentId === cat.id);
    console.log(`\n  ${cat.name} (${cat.id})`);
    if (children.length > 0) {
      children.forEach(child => {
        console.log(`    └─ ${child.name} (${child.id})`);
      });
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 How to reassign products:\n');
  console.log('You can reassign products using SQL in the Supabase dashboard:\n');
  console.log('UPDATE "Product"');
  console.log('SET "categoryId" = \'cat_mens-watches\'');
  console.log('WHERE id IN (\'product_id_1\', \'product_id_2\');\n');
  console.log('Or create a script like this to do batch updates.\n');
}

viewProducts();
