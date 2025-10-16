import { createClient } from '@supabase/supabase-js'

// Development fallback - replace with your actual values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

console.log('🔧 Supabase Config:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  envLoaded: !!import.meta.env.VITE_SUPABASE_URL
})

// Create client even with placeholder values for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: Test connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn('Supabase connection warning:', error.message)
  } else {
    console.log('✅ Supabase connected successfully')
  }
})