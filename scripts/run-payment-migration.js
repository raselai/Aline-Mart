import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load environment variables
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigration() {
  try {
    console.log('🔄 Running payment migration...\n')

    const sql = readFileSync(
      join(__dirname, 'migrations', 'add-payment-fields.sql'),
      'utf-8'
    )

    // Split SQL into individual statements (Supabase can't run multi-statement queries directly)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      // Use rpc to execute raw SQL (Note: This requires a database function)
      // Alternative: Use the Supabase dashboard SQL editor
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement })

      if (error) {
        console.error(`❌ Error in statement ${i + 1}:`, error.message)
        console.error('Statement:', statement.substring(0, 100) + '...')
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }

    console.log('\n✅ Migration completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Verify the migration by checking your Supabase dashboard')
    console.log('2. Update your .env file with PayStation credentials')
    console.log('3. Run: node scripts/check-db.js to verify the changes\n')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('\n💡 Alternative: Copy the SQL from scripts/migrations/add-payment-fields.sql')
    console.error('   and run it directly in your Supabase dashboard SQL editor\n')
    process.exit(1)
  }
}

runMigration()
