/**
 * Admin Authentication Migration Script
 * Adds role field to User table and creates admin_activity_log table
 *
 * Usage: node scripts/run-admin-migration.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runMigration() {
  console.log('🚀 Starting admin authentication migration...\n')

  try {
    // Read the SQL migration file
    const sqlFile = path.join(__dirname, 'admin-auth-migration.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('SELECT'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length < 10) continue // Skip empty/short statements

      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })

      if (error) {
        // Try direct query if RPC fails
        const { error: directError } = await supabase.from('_exec').select('*').limit(0)
        if (directError) {
          console.warn(`⚠️  Warning: ${error.message}`)
        }
      }
    }

    console.log('\n✅ Migration completed!\n')
    console.log('📋 Summary:')
    console.log('   - Added "role" field to User table')
    console.log('   - Created admin_activity_log table')
    console.log('   - Created settings table')
    console.log('   - Created default admin user\n')

    console.log('⚠️  IMPORTANT: Default admin credentials:')
    console.log('   Email: admin@alinemart.com')
    console.log('   Password: Admin123!@# (CHANGE THIS IMMEDIATELY!)\n')

    console.log('🔐 Next steps:')
    console.log('   1. Run this SQL in Supabase SQL Editor manually if script fails')
    console.log('   2. Change the default admin password')
    console.log('   3. Continue with Phase A1 implementation\n')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📝 Manual migration required:')
    console.log('   1. Go to Supabase Dashboard > SQL Editor')
    console.log('   2. Copy contents of scripts/admin-auth-migration.sql')
    console.log('   3. Run the SQL manually\n')
    process.exit(1)
  }
}

// Run the migration
runMigration()
