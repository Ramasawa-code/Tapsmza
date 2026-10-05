'use client'
import { useState, useEffect, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
const ADMIN_PASS = 'TAPSWIN2026!'
const SITE = 'https://tapsmza.site'

export default function Admin(){
  const [auth, setAuth] = useState(false)
  const [pass, setPass] = useState('')
  const [links, setLinks] = useState<any[]>([])
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [tab, setTab] = useState<'gen'|'list'>('gen')
  const [genCode, setGenCode] = useState('0011')
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(10)
  const [copied, setCopied] = useState('')
  const [qrColor, setQrColor] = useState('black')

  useEffect(()=>{ if(auth) fetchLinks() }, [auth])
  useEffect(()=>{ if(typeof window!=='undefined' && localStorage.getItem('taps_auth')==='1') setAuth(true) }, [])

  async function fetchLinks(){ const res = await fetch('/api/links'); setLinks(await res.json()) }
  function login(e:any){ e.preventDefault(); if(pass===ADMIN_PASS){ setAuth(true); localStorage.setItem('taps_auth','1') } else alert('Mal') }

  const assignedMap = useMemo(()=>{ const m=new Map(); links.forEach((l:any)=>m.set(l.code.toLowerCase(), l)); return m }, [links])
  const assignedSet = useMemo(()=> new Set(Array.from(assignedMap.keys())), [assignedMap])

  function pad(n:number){ return String(n).padStart(4,'0') }
  function normalize(v:string){ let s=v.toLowerCase().replace('algo','').trim(); if(/^\d+$/.test(s)) return pad(parseInt(s)); return s }

  async function save(){
    const c = normalize(code)
    if(!c ||!url) return alert('Falta código o URL');
    if(assignedSet.has(c)) return alert(`El ${c} ya está asignado`)
    await fetch('/api/links',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({code:c, url, name})});
    setCode(''); setUrl(''); setName(''); await fetchLinks();
    navigator.clipboard.writeText(`${SITE}/${c}`)
    alert(`¡LISTO! ${c} activado.`)
  }

  async function deactivate(cod: string){
    if(!confirm(`¿Seguro que querés DESACTIVAR la ${cod}? Va a quedar libre para volver a vender.`)) return
    await fetch(`/api/links?code=${cod}`, { method: 'DELETE' })
    await fetchLinks()
  }

  function downloadQR(cod: string, format:'png'|'svg'){
    const norm = normalize(cod)
    const el = document.getElementById(`qr-hidden-${norm}`)?.querySelector('svg');
    if(!el) return alert('No se encontró QR');
    const svgData = new XMLSerializer().serializeToString(el);
    const filename = `tapsmza-${norm}-${qrColor}`
    const textFill = qrColor === 'black'? 'black' : 'white';

    if(format==='svg'){
      const finalSvg = `<svg width="1100" height="1250" viewBox="0 0 1100 1250" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="1100" height="1100" rx="80" ry="80" fill="white"/><g transform="translate(50,50)">${svgData.replace(/<svg[^>]*>/,'').replace('</svg>','')}</g><text x="550" y="1190" text-anchor="middle" font-family="monospace" font-size="70" font-weight="bold" fill="${textFill}">${norm}</text></svg>`
      const blob = new Blob([finalSvg],{type:'image/svg+xml;charset=utf-8'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${filename}.svg`; a.click();
    } else {
      const canvas=document.createElement('canvas');
      const img=new Image();
      const blob=new Blob([svgData],{type:'image/svg+xml;charset=utf-8'});
      const objUrl=URL.createObjectURL(blob);
      img.onload=()=>{
        canvas.width=1100; canvas.height=1250;
        const ctx=canvas.getContext('2d')!;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#fff';
        const r=80;
        ctx.beginPath();
        ctx.moveTo(r,0); ctx.lineTo(1100-r,0); ctx.quadraticCurveTo(1100,0,1100,r);
        ctx.lineTo(1100,1100-r); ctx.quadraticCurveTo(1100,1100,1100-r,1100);
        ctx.lineTo(r,1100); ctx.quadraticCurveTo(0,1100,0,1100-r);
        ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0); ctx.closePath(); ctx.fill();
        ctx.drawImage(img,50,50,1000,1000);
        ctx.fillStyle=textFill;
        ctx.font='bold 70px monospace';
        ctx.textAlign='center';
        ctx.fillText(norm, 550, 1190);
        const a=document.createElement('a');
        a.download=`${filename}.png`;
        a.href=canvas.toDataURL('image/png');
        a.click();
        URL.revokeObjectURL(objUrl)
      };
      img.src=objUrl;
    }
  }

  function copy(text:string, id:string){
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(()=>setCopied(''),2000)
  }

  if(!auth) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}><form onSubmit={login} style={{background:'#171717',padding:32,borderRadius:24,width:320}}><h2 style={{color:'#fff'}}>TAPS Admin</h2><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Contraseña" style={{width:'100%',padding:14,borderRadius:12,border:'1px solid #333',background:'#0a0a0a',color:'#fff',marginTop:12}}/><button style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#fff',color:'#000',fontWeight:'bold',border:'none'}}>Entrar</button></form></div>

  return <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#fff',padding:16,maxWidth:700,margin:'0 auto'}}>
    <h1>TAPS MZA - Panel</h1>
    <div style={{display:'flex',gap:8,marginTop:12}}><button onClick={()=>setTab('gen')} style={{flex:1,padding:12,borderRadius:12,border:'none',background:tab==='gen'?'#fff':'#222',color:tab==='gen'?'#000':'#fff',fontWeight:'bold'}}>1. GENERAR QRs</button><button onClick={()=>setTab('list')} style={{flex:1,padding:12,borderRadius:12,border:'none',background:tab==='list'?'#fff':'#222',color:tab==='list'?'#000':'#fff',fontWeight:'bold'}}>2. VENDER / ASIGNAR</button></div>

    <div style={{position:'fixed', left:-9999, top:-9999}}>{Array.from({length:1000},(_,i)=>{const c=pad(i+1); return <div key={c} id={`qr-hidden-${c}`}><QRCodeSVG value={`${SITE}/${c}`} size={1000}/></div>})}<div id={`qr-hidden-${normalize(genCode)}`}><QRCodeSVG value={`${SITE}/${normalize(genCode)}`} size={1000}/></div></div>

    {tab==='gen' && <div style={{background:'#171717',padding:16,borderRadius:16,marginTop:20}}>
      <div style={{background:'#000',border:'1px solid #333',borderRadius:12,padding:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,fontWeight:'bold'}}>Color número PNG</div>
        <div style={{display:'flex',gap:6,background:'#222',padding:4,borderRadius:10}}>
          <button onClick={()=>setQrColor('black')} style={{padding:'8px 14px',borderRadius:8,border:'none',background:qrColor==='black'?'#fff':'transparent',color:qrColor==='black'?'#000':'#fff',fontWeight:'bold'}}>NEGRO</button>
          <button onClick={()=>setQrColor('white')} style={{padding:'8px 14px',borderRadius:8,border:'none',background:qrColor==='white'?'#fff':'transparent',color:qrColor==='white'?'#000':'#fff',fontWeight:'bold'}}>BLANCO</button>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginTop:12}}><input value={genCode} onChange={e=>setGenCode(e.target.value)} style={{flex:1,padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}/><button onClick={()=>downloadQR(genCode,'png')} style={{padding:'0 16px',borderRadius:10,background:'#fff',color:'#000',fontWeight:'bold'}}>PNG</button></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12, maxHeight:500, overflow:'auto'}}>
        {Array.from({length: Math.min(50, Math.max(0,to-from+1))}, (_,i)=>{
          const n=from+i; const c=pad(n); const isAssigned = assignedSet.has(c);
          return <div key={c} style={{background:'#000',padding:8,borderRadius:10,textAlign:'center',opacity:isAssigned?0.3:1, border:'1px solid #222'}}>
            <div style={{background:'#fff',padding:6,borderRadius:12,display:'inline-block'}}><QRCodeSVG value={`${SITE}/${c}`} size={70}/></div>
            <div style={{fontSize:11,marginTop:4, fontWeight:'bold'}}>{c} {isAssigned?'(VENDIDO)':''}</div>
            <button disabled={isAssigned} onClick={()=>downloadQR(c,'png')} style={{fontSize:10,padding:'4px 8px',borderRadius:6,marginTop:4,background:isAssigned?'#333':'#fff',color:'#000'}}>PNG</button>
          </div>
        })}
      </div>
    </div>}

    {tab==='list' && <div style={{marginTop:20}}>
      <div style={{background:'#171717',padding:16,borderRadius:16}}>
        <h3>Vender / Asignar</h3>
        <select value={code} onChange={e=>setCode(e.target.value)} style={{width:'100%',padding:14,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}>
          <option value="">-- Elegi disponible --</option>
          {Array.from({length:1000},(_,i)=>{
            const c=pad(i+1); const isAssigned = assignedSet.has(c); const data = assignedMap.get(c);
            return <option key={c} value={c} disabled={isAssigned}>{isAssigned?`❌ ${c} - VENDIDO a ${data?.name}` : `✅ ${c} - DISPONIBLE`}</option>
          })}
        </select>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre negocio" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:12}}/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link Google Review" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:8}}/>
        <button onClick={save} style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#fff',color:'#000',fontWeight:'bold',border:'none'}}>Activar Tarjeta {code?normalize(code):''}</button>
      </div>
      <div style={{marginTop:16}}>
        <h4>CRM - Vendidas ({links.length}/1000)</h4>
        {links.map((l:any)=>(<div key={l.code} style={{background:'#171717',padding:10,borderRadius:12,marginTop:8,display:'flex',gap:10,alignItems:'center'}}>
          <div style={{background:'#fff',padding:3,borderRadius:6}}><QRCodeSVG value={`${SITE}/${l.code}`} size={36}/></div>
          <div style={{flex:1}}><b>{l.code}</b> <span style={{background:'#ff0000',color:'#fff',fontSize:8,padding:'2px 6px',borderRadius:6,marginLeft:6}}>VENDIDA</span><div style={{fontSize:11,opacity:0.6}}>{l.name}</div><div style={{fontSize:9,opacity:0.4}}>{l.url?.slice(0,40)}...</div></div>
          <div style={{display:'flex',flexDirection:'column',gap:4}}>
            <button onClick={()=>copy(`${SITE}/${l.code}`, l.code)} style={{background:'#222',border:'none',color:'#fff',padding:'8px 10px',borderRadius:8,fontSize:10}}>{copied===l.code?'COPIADO':'COPIAR'}</button>
            <button onClick={()=>deactivate(l.code)} style={{background:'#ff000022',border:'1px solid #ff0000',color:'#ff5555',padding:'8px 10px',borderRadius:8,fontSize:10,fontWeight:'bold'}}>DESACTIVAR</button>
          </div>
        </div>))}
      </div>
    </div>}
  </div>
}
