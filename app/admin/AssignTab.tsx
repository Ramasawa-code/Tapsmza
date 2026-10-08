'use client'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { SITE, pad, normalize } from './qr'
import type { LinksStatus, TapLink, LinkCode } from './useLinks'
import { ConfirmDialog, Spinner, type PushToast } from './ui'

async function copyText(text: string){
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}

export default function AssignTab({ links, totals, total, page, totalPages, status, assignedMap, refresh, setPage, toast }: {
  links: TapLink[], totals: { taps: number, qr: number }, total: number, page: number, totalPages: number,
  status: LinksStatus, assignedMap: Map<string, LinkCode>,
  refresh: (fresh?: boolean) => Promise<void>, setPage: (p: number) => void, toast: PushToast
}){
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [copied, setCopied] = useState('')
  const [saving, setSaving] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [confirming, setConfirming] = useState('')
  const [deactivating, setDeactivating] = useState('')

  const ready = status === 'ready'
  const c = normalize(code)

  async function save(e: React.FormEvent){
    e.preventDefault()
    if(!c ||!url) return toast('error', 'Falta código o URL')
    if(assignedMap.has(c)) return toast('error', `El ${c} ya está asignado`, assignedMap.get(c)?.name)
    setSaving(true)
    try {
      const res = await fetch('/api/links',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({code:c, url, name})});
      if(!res.ok) throw new Error(`HTTP ${res.status}`)
      setCode(''); setUrl(''); setName(''); await refresh(true);
      const finalUrl = `${SITE}/${c}`
      const didCopy = await copyText(finalUrl)
      toast('success', `¡Listo! ${c} activada`, didCopy ? `URL para NFC Tools copiada: ${finalUrl}` : `URL para NFC Tools: ${finalUrl}`)
    } catch {
      toast('error', `No se pudo activar la ${c}`, 'No se guardó nada. Probá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function deactivate(cod: string){
    setConfirming(''); setDeactivating(cod)
    try {
      const res = await fetch(`/api/links?code=${cod}`, { method: 'DELETE' })
      if(!res.ok) throw new Error(`HTTP ${res.status}`)
      await refresh(true)
      toast('success', `${cod} desactivada`, 'Quedó libre para volver a vender.')
    } catch {
      toast('error', `No se pudo desactivar la ${cod}`, 'Sigue activa. Probá de nuevo.')
    } finally {
      setDeactivating('')
    }
  }

  async function copy(text: string, id: string){
    if(!await copyText(text)) return toast('error', 'No se pudo copiar', text)
    setCopied(id); setTimeout(()=>setCopied(''),2000)
  }

  async function retry(){
    setRetrying(true)
    await refresh(true)
    setRetrying(false)
  }

  const taps = totals.taps
  const qrScans = totals.qr
  const statValue = (v: number) => ready ? v : status==='error' ? '—' : <span className="skeleton" style={{width:48, height:24, alignSelf:'center'}}/>

  return (
    <>
      <form className="card" onSubmit={save}>
        <h2 className="card-title">Vender / Asignar link</h2>
        <p className="card-sub">Elegí una tarjeta libre y apuntala a la reseña del negocio.</p>

        <div className="stack" style={{marginTop:20}}>
          <div className="field">
            <label className="label" htmlFor="code">Tarjeta</label>
            <select id="code" className="select mono" value={code} onChange={e=>setCode(e.target.value)} disabled={!ready || saving}>
              {!ready && <option value="">{status==='loading' ? 'Cargando tarjetas…' : 'Sin conexión'}</option>}
              {ready && <option value="">Elegí una disponible</option>}
              {ready && Array.from({length:1000},(_,i)=>{
                const o=pad(i+1); const data = assignedMap.get(o);
                return <option key={o} value={o} disabled={!!data}>
                  {data?`❌ ${o} - VENDIDO a ${data.name}` : `✅ ${o} - DISPONIBLE`}
                </option>
              })}
            </select>
          </div>

          {code && !assignedMap.has(c) && <div className="nfc">
            <span className="label">URL final para NFC Tools</span>
            <div className="nfc-row">
              <div className="nfc-url mono">{SITE}/{c}</div>
              <button type="button" className={`btn btn-sm ${copied==='nfc'?'btn-success':'btn-primary'}`} onClick={()=>copy(`${SITE}/${c}`, 'nfc')}>{copied==='nfc'?'Copiado':'Copiar'}</button>
            </div>
          </div>}

          <div className="field">
            <label className="label" htmlFor="name">Negocio</label>
            <input id="name" className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del negocio" autoComplete="off" disabled={saving}/>
          </div>
          <div className="field">
            <label className="label" htmlFor="url">Link de Google Review</label>
            <input id="url" className="input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://g.page/r/…" inputMode="url" autoCapitalize="none" autoComplete="off" spellCheck={false} disabled={saving}/>
          </div>
          <button className="btn btn-primary btn-lg btn-block" disabled={!ready || saving} aria-busy={saving}>
            {saving ? <><Spinner/>Activando…</> : <>Activar tarjeta {code?c:''}</>}
          </button>
        </div>
      </form>

      <div className="stats">
        <div className="stat"><span className="label">Vendidas</span><div className="stat-value">{statValue(total)}{ready && <small>/1000</small>}</div></div>
        <div className="stat stat-accent"><span className="label">Taps</span><div className="stat-value">{statValue(taps)}</div></div>
        <div className="stat stat-accent"><span className="label">QR</span><div className="stat-value">{statValue(qrScans)}</div></div>
      </div>

      <div className="list-head"><h3 className="section-title">CRM · Vendidas</h3></div>

      {status==='loading' && <div className="list" aria-busy="true" aria-label="Cargando tarjetas">
        {[0,1,2].map(i=> <div key={i} className="row">
          <span className="skeleton" style={{width:54, height:54, borderRadius:8}}/>
          <div className="row-main">
            <span className="skeleton" style={{width:72, height:16}}/>
            <span className="skeleton" style={{width:'55%', height:12, marginTop:8}}/>
            <span className="skeleton" style={{width:'35%', height:12, marginTop:8}}/>
          </div>
        </div>)}
      </div>}

      {status==='error' && <div className="banner" role="alert">
        <span>No pudimos cargar las tarjetas.</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={retry} disabled={retrying} aria-busy={retrying}>{retrying && <Spinner/>}Reintentar</button>
      </div>}

      {ready && total===0 && <div className="empty">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="8" width="24" height="16" rx="3"/><path d="M18 13.5a4 4 0 0 1 0 5M21 11.5a7 7 0 0 1 0 9M9 13h4"/></svg>
        <strong>Todavía no vendiste ninguna tarjeta</strong>
        <span>Cuando actives una, vas a ver acá sus taps en vivo.</span>
      </div>}

      {ready && links.length>0 && <div className="list">
        {links.map(l=>{
          const num = parseInt(l.code)
          const rowTotal = (Number(l.clicks)||0)+(Number(l.qrClicks)||0)
          const isOld = num <= 10
          return (<div key={l.code} className={`row${deactivating===l.code?' is-pending':''}`}>
            <div className="row-qr"><QRCodeSVG value={`${SITE}/${l.code}?s=qr`} size={44}/></div>
            <div className="row-main">
              <div className="row-title"><span className="row-code mono">{l.code}</span><span className="badge">Vendida</span></div>
              <div className="row-name" title={l.name}>{l.name}</div>
              <div className="row-stats">
                {isOld ? <span>{rowTotal} taps</span> : <><span>{l.clicks||0} taps</span><span>{l.qrClicks||0} QR</span><span>{rowTotal} total</span></>}
              </div>
            </div>
            <div className="row-actions">
              <button type="button" className={`btn btn-sm ${copied===l.code?'btn-success':'btn-secondary'}`} onClick={()=>copy(`${SITE}/${l.code}`, l.code)}>{copied===l.code?'Copiado':'Copiar URL'}</button>
              <button type="button" className="btn btn-sm btn-danger" disabled={!!deactivating} aria-busy={deactivating===l.code} onClick={()=>setConfirming(l.code)}>{deactivating===l.code ? <Spinner/> : 'Desactivar'}</button>
            </div>
          </div>)
        })}
      </div>}

      {ready && total>0 && <nav className="pager" aria-label="Paginación">
        <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setPage(page-1)} disabled={page<=1}>Anterior</button>
        <span className="pager-info mono">Página {page} de {totalPages} · {total} vendidas</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={()=>setPage(page+1)} disabled={page>=totalPages}>Siguiente</button>
      </nav>}

      <ConfirmDialog open={!!confirming} title={`¿Desactivar la ${confirming}?`}
        body="Va a quedar libre para volver a vender y el link dejará de redirigir."
        confirmLabel="Desactivar" onConfirm={()=>deactivate(confirming)} onCancel={()=>setConfirming('')}/>
    </>
  )
}
