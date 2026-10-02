'use client'
import { useState, useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
const ADMIN_PASS = 'TAPSWIN2026!'
export default function Admin(){
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [links, setLinks] = useState<any[]>([])
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('')
  useEffect(()=>{ if(auth) fetchLinks() }, [auth])
  async function fetchLinks(){ const res = await fetch('/api/links'); const data = await res.json(); setLinks(data) }
  function handleLogin(e:any){ e.preventDefault(); if(pass===ADMIN_PASS){ setAuth(true); if(typeof window!=='undefined') localStorage.setItem('taps_auth','1') } else alert('Incorrecta') }
  useEffect(()=>{ if(typeof window!=='undefined' && localStorage.getItem('taps_auth')==='1') setAuth(true) }, [])
  async function save(){
    if(!code ||!url) return alert('Falta codigo y URL')
    setLoading(true)
    await fetch('/api/links', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({code: code.toLowerCase(), url, name}) })
    setCode(''); setUrl(''); setName(''); await fetchLinks(); setLoading(false)
  }
  async function del(c: string){ if(!confirm('Borrar '+c+'?')) return; await fetch('/api/links?code='+c, {method:'DELETE'}); fetchLinks() }
  function downloadQR(codeToDl: string, format: 'png' | 'svg'){
    const svg = document.getElementById(`qr-${codeToDl}`)?.querySelector('svg');
    if(!svg) return;
    if(format==='svg'){
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], {type:'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url; a.download=`${codeToDl}.svg`; a.click();
    } else {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], {type:'image/svg+xml'});
      const url = URL.createObjectURL(blob);
      img.onload=()=>{
        canvas.width=1000; canvas.height=1000;
        if(ctx){ ctx.fillStyle='#fff'; ctx.fillRect(0,0,1000,1000); ctx.drawImage(img,0,0,1000,1000); }
        const a = document.createElement('a'); a.download=`${codeToDl}.png`; a.href=canvas.toDataURL('image/png'); a.click();
        URL.revokeObjectURL(url);
      };
      img.src=url;
    }
  }
  if(!auth){
    return <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a'}}>
      <form onSubmit={handleLogin} style={{background:'#171717', padding:32, borderRadius:24, width:320}}>
        <h2 style={{color:'#fff'}}>TAPS Admin</h2><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Contraseña" style={{width:'100%', padding:14, borderRadius:12, border:'1px solid #333', background:'#0a0a0a', color:'#fff', marginTop:12}}/>
        <button style={{width:'100%', marginTop:12, padding:14, borderRadius:12, background:'#fff', color:'#000', fontWeight:'bold', border:0}}>Entrar</button>
      </form>
    </div>
  }
  const filtered = links.filter(l=>!filter || l.code.includes(filter.toLowerCase()) || (l.name||'').toLowerCase().includes(filter.toLowerCase()))
  return <div style={{background:'#0a0a0a', minHeight:'100vh', color:'#fff', padding:16, maxWidth:600, margin:'0 auto'}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12}}><h1>TAPS Admin</h1><button onClick={()=>{localStorage.removeItem('taps_auth'); setAuth(false)}} style={{background:'#222', color:'#fff', border:0, padding:'8px 12px', borderRadius:8}}>Salir</button></div>
    <div style={{background:'#171717', padding:16, borderRadius:16, marginTop:20}}>
      <h3 style={{marginTop:0}}>Asignar QR a Negocio</h3>
      <p style={{fontSize:12, opacity:0.6}}>1. Agarrá tarjeta física (ej: algo0005) 2. Pegá link Google Review 3. Guardar</p>
      <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Codigo: algo0005" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #333', background:'#000', color:'#fff', marginTop:8}}/>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre: Parrilla Pepe" style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #333', background:'#000', color:'#fff', marginTop:8}}/>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link Google: https://g.page/r/..." style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #333', background:'#000', color:'#fff', marginTop:8}}/>
      <button onClick={save} disabled={loading} style={{width:'100%', marginTop:12, padding:14, borderRadius:12, background:'#fff', color:'#000', fontWeight:'bold', border:0}}>{loading?'Guardando...':'Guardar y Activar'}</button>
      {code && <div style={{marginTop:16, textAlign:'center', background:'#000', padding:12, borderRadius:12}}><p style={{fontSize:12, opacity:0.6}}>Preview: tapsmza.site/{code.toLowerCase()}</p><div id={`qr-${code.toLowerCase()}`} style={{background:'#fff', display:'inline-block', padding:8, borderRadius:8, marginTop:8}}><QRCodeSVG value={`https://tapsmza.site/${code.toLowerCase()}`} size={140}/></div><div style={{display:'flex', gap:8, justifyContent:'center', marginTop:8}}><button onClick={()=>downloadQR(code.toLowerCase(),'png')} style={{padding:'6px 12px', borderRadius:8, border:0, background:'#222', color:'#fff', fontSize:12}}>PNG para Canva</button><button onClick={()=>downloadQR(code.toLowerCase(),'svg')} style={{padding:'6px 12px', borderRadius:8, border:0, background:'#222', color:'#fff', fontSize:12}}>SVG para Canva</button></div></div>}
    </div>
    <div style={{marginTop:20}}><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Buscar..." style={{width:'100%', padding:12, borderRadius:10, border:'1px solid #333', background:'#171717', color:'#fff'}}/><p style={{opacity:0.5, fontSize:12}}>{filtered.length} asignados</p>
      {filtered.map(l=>(<div key={l.code} style={{background:'#171717', padding:12, borderRadius:12, marginTop:8, display:'flex', gap:12, alignItems:'center'}}><div id={`qr-${l.code}`} style={{background:'#fff', padding:4, borderRadius:6}}><QRCodeSVG value={`https://tapsmza.site/${l.code}`} size={50}/></div><div style={{flex:1, overflow:'hidden'}}><div style={{fontWeight:'bold'}}>{l.code}</div><div style={{fontSize:11, opacity:0.6, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{l.name} - {l.url}</div></div><button onClick={()=>downloadQR(l.code,'png')} style={{background:'#222', border:0, color:'#fff', padding:6, borderRadius:8, fontSize:10}}>PNG</button><button onClick={()=>del(l.code)} style={{background:'#3a1010', border:0, color:'#ff6b6b', padding:8, borderRadius:8}}>X</button></div>))}
    </div>
  </div>
}
