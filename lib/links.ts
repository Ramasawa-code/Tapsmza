import { getSupabase } from './supabase'

export type LinkRecord = { code: string, url: string, name: string, clicks: number, qrClicks: number }
// Compact shape used by the generator / dropdown / KPI stats.
export type LinkCode = { code: string, name: string, clicks: number, qrClicks: number }

export const PAGE_SIZE = 10

export type LinksPage = {
  items: LinkRecord[]
  codes: LinkCode[]
  totals: { taps: number, qr: number }
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Fallback store so the admin panel keeps working without Supabase env (dev only).
const mem = new Map<string, LinkRecord>()

function rowToRecord(row: any): LinkRecord {
  return {
    code: row.code,
    url: row.url,
    name: row.name || '',
    clicks: Number(row.clicks) || 0,
    qrClicks: Number(row.qr_clicks) || 0,
  }
}

function buildPage(all: LinkRecord[], requested: number): LinksPage {
  const total = all.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(Math.max(1, requested), totalPages)
  const start = (page - 1) * PAGE_SIZE
  const items = all.slice(start, start + PAGE_SIZE)
  const codes = all.map(l => ({ code: l.code, name: l.name, clicks: l.clicks, qrClicks: l.qrClicks }))
  const totals = codes.reduce((a, c) => ({ taps: a.taps + c.clicks, qr: a.qr + c.qrClicks }), { taps: 0, qr: 0 })
  return { items, codes, totals, total, page, pageSize: PAGE_SIZE, totalPages }
}

export async function getLink(code: string): Promise<LinkRecord | null> {
  const sb = getSupabase()
  if (!sb) return mem.get(code) || null
  const { data, error } = await sb.from('links').select('*').eq('code', code).maybeSingle()
  if (error) throw error
  return data ? rowToRecord(data) : null
}

export async function upsertLink(code: string, url: string, name: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) {
    const prev = mem.get(code)
    mem.set(code, { code, url, name, clicks: prev?.clicks ?? 0, qrClicks: prev?.qrClicks ?? 0 })
    return
  }
  // Update first so an existing card keeps its tap/QR counters; insert only when new.
  const { data, error } = await sb.from('links').update({ url, name }).eq('code', code).select('code')
  if (error) throw error
  if (!data || data.length === 0) {
    const ins = await sb.from('links').insert({ code, url, name })
    if (ins.error) throw ins.error
  }
}

export async function deleteLink(code: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) { mem.delete(code); return }
  const { error } = await sb.from('links').delete().eq('code', code)
  if (error) throw error
}

// Atomic tap/QR increment via the `increment_link_counter` SQL function.
export async function incrementCounter(code: string, isQr: boolean): Promise<void> {
  const sb = getSupabase()
  if (!sb) {
    const l = mem.get(code)
    if (l) { if (isQr) l.qrClicks += 1; else l.clicks += 1 }
    return
  }
  const { error } = await sb.rpc('increment_link_counter', { p_code: code, p_qr: isQr })
  if (error) throw error
}

// One page of at most PAGE_SIZE links, plus the companion data the UI needs
// (every assigned code, and the aggregate tap/QR totals) in a single round trip.
export async function listLinks(requested = 1): Promise<LinksPage> {
  const sb = getSupabase()
  const wanted = Math.max(1, Math.floor(requested) || 1)
  if (!sb) return buildPage(Array.from(mem.values()).sort((a, b) => a.code.localeCompare(b.code)), wanted)

  // Count first: PostgREST rejects an out-of-range offset (PGRST103) instead of
  // returning an empty page, so clamp the page before asking for rows.
  const { count, error: countErr } = await sb.from('links').select('*', { count: 'exact', head: true })
  if (countErr) throw countErr
  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(wanted, totalPages)

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, error } = await sb
    .from('links')
    .select('*')
    .order('code', { ascending: true })
    .range(from, to)
  if (error) throw error

  const items = (data || []).map(rowToRecord)

  const { data: codeRows, error: codeErr } = await sb
    .from('links')
    .select('code,name,clicks,qr_clicks')
    .order('code', { ascending: true })
  if (codeErr) throw codeErr

  const codes: LinkCode[] = (codeRows || []).map((r: any) => ({
    code: r.code,
    name: r.name || '',
    clicks: Number(r.clicks) || 0,
    qrClicks: Number(r.qr_clicks) || 0,
  }))
  const totals = codes.reduce((a, c) => ({ taps: a.taps + c.clicks, qr: a.qr + c.qrClicks }), { taps: 0, qr: 0 })

  return { items, codes, totals, total, page, pageSize: PAGE_SIZE, totalPages }
}
