require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function runMigration() {
  console.log('Running Vendor table migration...\n');

  try {
    // Check if table already exists by trying to select from it
    const { data, error: checkError } = await supabase
      .from('Vendor')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('Vendor table already exists.');

      // Show current vendor count
      const { count } = await supabase
        .from('Vendor')
        .select('*', { count: 'exact', head: true });

      console.log(`Current vendor count: ${count || 0}`);
      return;
    }

    // Table doesn't exist, show SQL to run manually
    console.log('Vendor table does not exist.');
    console.log('\nPlease run the following SQL in Supabase Dashboard (SQL Editor):\n');
    console.log('-------------------------------------------');

    const sqlPath = path.join(__dirname, 'migrations', 'create-vendor-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log(sql);

    console.log('-------------------------------------------');
    console.log('\nGo to: Supabase Dashboard > SQL Editor > New Query');
    console.log('Paste the SQL above and click "Run"');

  } catch (err) {
    console.error('Migration error:', err.message);
  }
}

runMigration();
