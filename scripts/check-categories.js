require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCategories() {
  const { data, error } = await supabase
    .from('Category')
    .select('id, name, slug, parentId')
    .order('name');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== ALL CATEGORIES (' + data.length + ') ===\n');

  // Group by root vs child
  const roots = data.filter(c => !c.parentId);
  const children = data.filter(c => c.parentId);

  console.log('ROOT CATEGORIES (' + roots.length + '):');
  roots.forEach(r => console.log('  - ' + r.name + ' [' + r.slug + ']'));

  console.log('\nCHILD CATEGORIES (' + children.length + '):');
  children.forEach(c => {
    const parent = data.find(p => p.id === c.parentId);
    console.log('  - ' + c.name + ' -> parent: ' + (parent ? parent.name : 'unknown'));
  });

  // Show tree structure
  console.log('\n=== CATEGORY TREE ===');
  roots.forEach(root => {
    console.log('\n' + root.name + ' (' + root.slug + ')');
    const directChildren = children.filter(c => c.parentId === root.id);
    directChildren.forEach(child => {
      console.log('  └─ ' + child.name + ' (' + child.slug + ')');
      const grandchildren = children.filter(c => c.parentId === child.id);
      grandchildren.forEach(gc => {
        console.log('      └─ ' + gc.name + ' (' + gc.slug + ')');
      });
    });
  });
}

checkCategories();
