'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { QRCodeSVG } from 'qrcode.react'
import { SITE, pad, normalize, downloadQR, type QrColor } from './qr'
import type { TapLink } from './useLinks'
import { Spinner, type PushToast } from './ui'

const MAX_CODE = 9999
const STAGGER_CAP = 20

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

// Typing is free-form; the value is only committed on blur or Enter, so half-typed
// numbers never reshuffle the grid.
function NumberField({ id, label, value, onCommit }: { id: string, label: string, value: number, onCommit: (n: number) => void }){
  const [draft, setDraft] = useState(String(value))
  useEffect(()=>{ setDraft(String(value)) }, [value])

  function commit(){
    const n = parseInt(draft)
    setDraft(String(value))
    if(!Number.isNaN(n)) onCommit(n)
  }

  return (
    <div className="field">
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input mono num" inputMode="numeric" autoComplete="off" value={draft}
        onChange={e=>setDraft(e.target.value.replace(/\D/g,'').slice(0,4))}
        onFocus={e=>e.currentTarget.select()} onBlur={commit}
        onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); e.currentTarget.blur() } }}/>
    </div>
  )
}

export default function GeneratorTab({ assignedMap, toast }: { assignedMap: Map<string, TapLink>, toast: PushToast }){
  const [genCode, setGenCode] = useState('0011')
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(10)
  const [qrColor, setQrColor] = useState<QrColor>('black')
  const [busy, setBusy] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // from ≤ to always holds
  const size = to-from+1
  const batch = useMemo(()=> Array.from({length: size}, (_,i)=>pad(from+i)), [from, size])
  // The full-size QR that downloadQR serialises. Rendered on demand for the one code being
  // downloaded, so a long range doesn't keep thousands of 1000px SVGs in the DOM.
  const [hiddenCode, setHiddenCode] = useState('')
  // Each cell previews the card: white card with black number, or black card with white number
  const cardClass = qrColor === 'white' ? 'is-dark' : 'is-light'

  useEffect(()=>{ scrollRef.current?.scrollTo({ top: 0 }) }, [from])

  function changeFrom(v: number){ const f = clamp(v, 1, MAX_CODE); setFrom(f); setTo(Math.max(f, to)) }
  function changeTo(v: number){ setTo(clamp(v, from, MAX_CODE)) }

  async function download(cod: string, format: 'png'|'svg', key = `${cod}-${format}`){
    flushSync(()=>{ setBusy(key); setHiddenCode(normalize(cod)) })
    try { await downloadQR(cod, format, qrColor) }
    catch { toast('error', 'No se pudo generar el QR', 'Probá de nuevo.') }
    finally { setBusy('') }
  }

  return (
    <div className="card">
      <div aria-hidden className="offscreen"><div id={`qr-hidden-${hiddenCode}`}><QRCodeSVG value={`${SITE}/${hiddenCode}?s=qr`} size={1000}/></div></div>

      <h2 className="card-title">Generador libre</h2>
      <p className="card-sub">QRs vírgenes listos para mandar a imprenta.</p>

      <div className="option-row">
        <div><strong>Color del número</strong><small>Blanca = negro · Negra = blanco</small></div>
        <div className="segmented">
          <button type="button" aria-pressed={qrColor==='black'} onClick={()=>setQrColor('black')}>Negro</button>
          <button type="button" aria-pressed={qrColor==='white'} onClick={()=>setQrColor('white')}>Blanco</button>
        </div>
      </div>

      <div className="field" style={{marginTop:20}}>
        <label className="label" htmlFor="gen-code">Probar un solo QR</label>
        <div className="inline inline-wrap">
          <div className="input-group">
            <span className="prefix mono">{SITE.replace('https://','')}/</span>
            <input id="gen-code" className="mono" value={genCode} onChange={e=>setGenCode(e.target.value)} autoComplete="off" spellCheck={false}/>
          </div>
          <button type="button" className="btn btn-primary" disabled={!!busy} aria-busy={busy==='single-png'} onClick={()=>download(genCode,'png','single-png')}>{busy==='single-png' && <Spinner/>}PNG</button>
          <button type="button" className="btn btn-secondary" disabled={!!busy} onClick={()=>download(genCode,'svg','single-svg')}>SVG</button>
        </div>
      </div>

      <hr className="divider"/>

      <div className="range-head">
        <h3 className="section-title">Tanda para imprenta</h3>
        <span className="range-summary mono num" aria-live="polite">{pad(from)} → {pad(to)} · {size} {size===1?'código':'códigos'}</span>
      </div>

      <div className="range">
        <NumberField id="from" label="Desde" value={from} onCommit={changeFrom}/>
        <NumberField id="to" label="Hasta" value={to} onCommit={changeTo}/>
      </div>

      <div className="qr-frame">
        <div className="qr-scroll" ref={scrollRef} tabIndex={0} role="group" aria-label={`Códigos ${pad(from)} a ${pad(to)}`}>
          <div className="qr-grid">
            {batch.map((c,i)=>{
              const data = assignedMap.get(c); const isAssigned = !!data
              return <div key={c} className={`qr-cell ${cardClass}${isAssigned?' is-sold':''}`} style={{'--i': Math.min(i, STAGGER_CAP)} as React.CSSProperties}>
                <div className="qr-tile"><QRCodeSVG value={`${SITE}/${c}?s=qr`} size={84}/></div>
                <div className="qr-code mono">{c}</div>
                {isAssigned && <span className="badge badge-danger">Vendido</span>}
                {isAssigned && <div className="qr-owner" title={data.name}>{data.name}</div>}
                <div className="qr-actions">
                  <button type="button" className="btn btn-primary btn-sm" disabled={isAssigned || !!busy} aria-busy={busy===`${c}-png`} onClick={()=>download(c,'png')}>{busy===`${c}-png` ? <Spinner/> : 'PNG'}</button>
                  <button type="button" className="btn btn-secondary btn-sm" disabled={isAssigned || !!busy} onClick={()=>download(c,'svg')}>SVG</button>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
