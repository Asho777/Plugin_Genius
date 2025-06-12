import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add a function to handle logout and redirect to splash screen
export const handleLogout = async () => {
  await supabase.auth.signOut()
  window.location.href = '/'
}
