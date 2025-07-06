import { createClient } from '@supabase/supabase-js'

// Default to a valid URL format if environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add a function to handle logout and redirect to splash screen
export const handleLogout = async () => {
  await supabase.auth.signOut()
  window.location.href = '/'
}
