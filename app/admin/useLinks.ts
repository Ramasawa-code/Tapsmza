'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type TapLink = { code: string, url: string, name: string, clicks: number, qrClicks: number }
export type LinksStatus = 'loading' | 'ready' | 'error'

const POLL_MS = 3000
const TIMEOUT_MS = 10000

export function useLinks(enabled: boolean){
  // null = never loaded, so "loading" and "0 vendidas" can't be confused
  const [links, setLinks] = useState<TapLink[] | null>(null)
  const [failed, setFailed] = useState(false)
  const inflight = useRef<Promise<void> | null>(null)
  const lastJson = useRef('')

  // fresh: wait out any request already in flight and fetch again (use after a mutation)
  const refresh = useCallback(async (fresh = false) => {
    if(inflight.current){
      await inflight.current
      if(!fresh) return
    }
    const ctrl = new AbortController()
    const timer = setTimeout(()=>ctrl.abort(), TIMEOUT_MS)
    const run = (async ()=>{
      try {
        const res = await fetch('/api/links', { cache: 'no-store', signal: ctrl.signal })
        if(!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if(!Array.isArray(data)) throw new Error('bad payload')
        const json = JSON.stringify(data)
        // identical polls keep the same array so the QR lists don't re-render every 3s
        if(json !== lastJson.current){ lastJson.current = json; setLinks(data) }
        setFailed(false)
      } catch {
        setFailed(true)
      } finally {
        clearTimeout(timer)
        inflight.current = null
      }
    })()
    inflight.current = run
    await run
  }, [])

  useEffect(()=>{
    if(!enabled) return
    let id: ReturnType<typeof setInterval> | undefined
    const start = () => { refresh(); id = setInterval(()=>refresh(), POLL_MS) }
    const stop = () => { clearInterval(id); id = undefined }
    const onVisibility = () => { if(document.hidden) stop(); else if(!id) start() }
    if(!document.hidden) start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [enabled, refresh])

  const status: LinksStatus = links ? 'ready' : failed ? 'error' : 'loading'
  // stale: we have data on screen but the latest poll failed
  return { links: links ?? [], status, stale: failed && links !== null, refresh }
}
