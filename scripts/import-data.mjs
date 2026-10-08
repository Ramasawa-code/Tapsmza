// One-off import of the old Upstash KV dump (data.json) into Supabase.
//
//   npm run db:import          (uses .env via node --env-file)
//   node --env-file=.env scripts/import-data.mjs
//
// Only entries that actually have a `url` (i.e. sold cards) are imported.
// Safe to re-run, but it force-overwrites counters with the backup values.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Missing SUPABASE_URL and/or SUPABASE_SECRET_KEY. Run with: node --env-file=.env scripts/import-data.mjs')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const raw = JSON.parse(readFileSync(join(root, 'data.json'), 'utf8'))

const rows = []
for (const [k, v] of Object.entries(raw)) {
  if (!v || !v.url) continue
  const code = k.replace(/^taps:/, '').toLowerCase().padStart(4, '0')
  rows.push({
    code,
    url: v.url,
    name: v.name || '',
    clicks: Number(v.clicks) || 0,
    qr_clicks: Number(v.qrClicks) || 0,
    // Always set it: in a bulk upsert, if any row includes a column, rows that
    // omit it get NULL instead of the column default.
    created_at: v.createdAt || new Date().toISOString(),
  })
}

if (rows.length === 0) {
  console.log('Nothing to import (no entries with a url).')
  process.exit(0)
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const { error } = await sb.from('links').upsert(rows, { onConflict: 'code' })
if (error) {
  console.error(error)
  process.exit(1)
}
console.log(`Imported ${rows.length} link(s): ${rows.map(r => r.code).join(', ')}`)
