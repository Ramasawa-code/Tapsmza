import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

// Server-only client. Uses the secret key so it bypasses RLS; never expose this
// key (or this module) to the browser. Returns null when env vars are missing so
// the app can fall back to an in-memory store during local development.
export function getSupabase(): SupabaseClient | null {
  if (client) return client
  const url = process.env.SUPABASE_URL || ''
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !key) return null
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
