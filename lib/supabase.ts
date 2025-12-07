import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rzalfxuexvdcgydxffeh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6YWxmeHVleHZkY2d5ZHhmZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4OTk3OTQsImV4cCI6MjA4MDQ3NTc5NH0.GuZNUP-e-4-HiVhbt5qeLJ-la6xop_lZq1vYeYwd0I8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
