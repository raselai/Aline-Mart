require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runMigration() {
  console.log('Running costPrice migration...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'migrations', 'add-cost-price.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If RPC doesn't exist, try direct query approach
      console.log('RPC not available, trying alternative approach...');

      // Check if column already exists
      const { data: columns, error: checkError } = await supabase
        .from('Product')
        .select('costPrice')
        .limit(1);

      if (checkError && checkError.message.includes('column "costPrice" does not exist')) {
        console.log('Column does not exist. Please run the following SQL in Supabase Dashboard:\n');
        console.log('-------------------------------------------');
        console.log(sql);
        console.log('-------------------------------------------');
        console.log('\nGo to: Supabase Dashboard > SQL Editor > New Query');
        return;
      } else if (!checkError) {
        console.log('Column "costPrice" already exists in Product table.');
        return;
      }
    }

    console.log('Migration completed successfully!');

    // Verify the column was added
    const { data, error: verifyError } = await supabase
      .from('Product')
      .select('id, name, price, costPrice')
      .limit(3);

    if (verifyError) {
      console.error('Verification error:', verifyError.message);
    } else {
      console.log('\nVerification - Sample products with costPrice field:');
      data.forEach(p => {
        console.log(`  - ${p.name}: price=$${p.price}, costPrice=${p.costPrice || 'null'}`);
      });
    }

  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

runMigration();
