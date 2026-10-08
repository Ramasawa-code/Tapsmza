'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type TapLink = { code: string, url: string, name: string, clicks: number, qrClicks: number }
export type LinkCode = { code: string, name: string, clicks: number, qrClicks: number }
export type LinksStatus = 'loading' | 'ready' | 'error'

export type LinksPage = {
  items: TapLink[]
  codes: LinkCode[]
  totals: { taps: number, qr: number }
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const TIMEOUT_MS = 10000

// No polling: we fetch on load, whenever the page changes, and on demand via refresh().
export function useLinks(enabled: boolean){
  // null = never loaded, so "loading" and "0 vendidas" can't be confused
  const [data, setData] = useState<LinksPage | null>(null)
  const [page, setPageState] = useState(1)
  const [failed, setFailed] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const inflight = useRef<Promise<void> | null>(null)
  const pageRef = useRef(1)
  pageRef.current = page

  const load = useCallback(async (targetPage: number) => {
    const ctrl = new AbortController()
    const timer = setTimeout(()=>ctrl.abort(), TIMEOUT_MS)
    setRefreshing(true)
    try {
      const res = await fetch(`/api/links?page=${targetPage}`, { cache: 'no-store', signal: ctrl.signal })
      if(!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()
      if(!payload || !Array.isArray(payload.items)) throw new Error('bad payload')
      setData(payload)
      setFailed(false)
      // The server clamps out-of-range pages; keep local state in sync.
      if(payload.page !== targetPage) setPageState(payload.page)
    } catch {
      setFailed(true)
    } finally {
      clearTimeout(timer)
      setRefreshing(false)
      inflight.current = null
    }
  }, [])

  // fresh: wait out any request already in flight and fetch again (use after a mutation)
  const refresh = useCallback(async (fresh = false) => {
    if(inflight.current){
      await inflight.current
      if(!fresh) return
    }
    const run = load(pageRef.current)
    inflight.current = run
    await run
  }, [load])

  const setPage = useCallback((p: number) => { setPageState(Math.max(1, p)) }, [])

  useEffect(()=>{
    if(enabled) refresh()
  }, [enabled, page, refresh])

  const status: LinksStatus = data ? 'ready' : failed ? 'error' : 'loading'
  // stale: we have data on screen but the latest refresh failed
  return {
    links: data?.items ?? [],
    codes: data?.codes ?? [],
    totals: data?.totals ?? { taps: 0, qr: 0 },
    total: data?.total ?? 0,
    page,
    pageSize: data?.pageSize ?? 10,
    totalPages: data?.totalPages ?? 1,
    status,
    stale: failed && data !== null,
    refreshing,
    refresh,
    setPage,
  }
}
