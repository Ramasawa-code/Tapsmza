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
    if(assignedSet.has(c)) return alert(`El ${c} ya está asignado a ${assignedMap.get(c)?.name}`)
    await fetch('/api/links',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({code:c, url, name})});
    setCode(''); setUrl(''); setName(''); await fetchLinks();
    const finalUrl = `${SITE}/${c}`
    navigator.clipboard.writeText(finalUrl)
    alert(`¡LISTO! ${c} activado.\n\nURL para NFC Tools copiada:\n${finalUrl}`)
  }

  function downloadQR(cod: string, format:'png'|'svg'){
    const norm = normalize(cod)
    const el = document.getElementById(`qr-hidden-${norm}`)?.querySelector('svg');
    if(!el) return alert('No se encontró QR');
    const svgData = new XMLSerializer().serializeToString(el);
    const filename = `tapsmza-${norm}`

    if(format==='svg'){
      const withText = svgData.replace('</svg>', `<text x="50%" y="98%" text-anchor="middle" font-family="monospace" font-size="40" font-weight="bold" fill="black">${norm}</text></svg>`)
      const blob = new Blob([withText],{type:'image/svg+xml;charset=utf-8'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${filename}.svg`; a.click();
    } else {
      const canvas=document.createElement('canvas');
      const img=new Image();
      const blob=new Blob([svgData],{type:'image/svg+xml;charset=utf-8'});
      const objUrl=URL.createObjectURL(blob);
      img.onload=()=>{
        canvas.width=1000; canvas.height=1150;
        const ctx=canvas.getContext('2d')!;
        ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,1000,1000);
        ctx.fillStyle='#000'; ctx.font='bold 70px monospace'; ctx.textAlign='center';
        ctx.fillText(norm, 500, 1100);
        const a=document.createElement('a'); a.download=`${filename}.png`; a.href=canvas.toDataURL('image/png'); a.click();
        URL.revokeObjectURL(objUrl)
      };
      img.src=objUrl;
    }
  }

  function copy(text:string, id:string){
    navigator.clipboard.writeText(text); setCopied(id); setTimeout(()=>setCopied(''),2000)
  }

  if(!auth) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}><form onSubmit={login} style={{background:'#171717',padding:32,borderRadius:24,width:320}}><h2 style={{color:'#fff'}}>TAPS Admin</h2><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Contraseña" style={{width:'100%',padding:14,borderRadius:12,border:'1px solid #333',background:'#0a0a0a',color:'#fff',marginTop:12}}/><button style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#fff',color:'#000',fontWeight:'bold',border:0}}>Entrar</button></form></div>

  return <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#fff',padding:16,maxWidth:700,margin:'0 auto'}}>
    <h1>TAPS MZA - Panel</h1>
    <div style={{display:'flex',gap:8,marginTop:12}}><button onClick={()=>setTab('gen')} style={{flex:1,padding:12,borderRadius:12,border:0,background:tab==='gen'?'#fff':'#222',color:tab==='gen'?'#000':'#fff',fontWeight:'bold'}}>1. GENERAR QRs VIRGENES</button><button onClick={()=>setTab('list')} style={{flex:1,padding:12,borderRadius:12,border:0,background:tab==='list'?'#fff':'#222',color:tab==='list'?'#000':'#fff',fontWeight:'bold'}}>2. VENDER / ASIGNAR</button></div>

    <div style={{position:'fixed', left:-9999, top:-9999}}>{Array.from({length:1000},(_,i)=>{const c=pad(i+1); return <div key={c} id={`qr-hidden-${c}`}><QRCodeSVG value={`${SITE}/${c}`} size={1000}/></div>})}<div id={`qr-hidden-${normalize(genCode)}`}><QRCodeSVG value={`${SITE}/${normalize(genCode)}`} size={1000}/></div></div>

    {tab==='gen' && <div style={{background:'#171717',padding:16,borderRadius:16,marginTop:20}}>
      <h3 style={{margin:0}}>Generador libre (imprenta)</h3>
      <p style={{opacity:0.6,fontSize:12}}>Los tachados en gris ya estan vendidos. No los vuelvas a imprimir.</p>

      <label style={{fontSize:12,opacity:0.7}}>Probar un solo QR:</label>
      <div style={{display:'flex',gap:8,marginTop:6}}><span style={{padding:12,background:'#000',borderRadius:'10px 0 0 10px',border:'1px solid #333',borderRight:0,fontSize:12,opacity:0.6}}>{SITE}/</span><input value={genCode} onChange={e=>setGenCode(e.target.value)} style={{flex:1,padding:12,borderRadius:'0 10px 10px 0',border:'1px solid #333',background:'#000',color:'#fff'}}/><button onClick={()=>downloadQR(genCode,'png')} style={{padding:'0 16px',borderRadius:10,border:0,background:'#fff',color:'#000',fontWeight:'bold'}}>PNG</button><button onClick={()=>downloadQR(genCode,'svg')} style={{padding:'0 16px',borderRadius:10,border:0,background:'#333',color:'#fff'}}>SVG</button></div>

      <hr style={{margin:'20px 0',borderColor:'#222'}}/>
      <h4>Tanda para imprenta (ej: 1 a 10)</h4>
      <div style={{display:'flex',gap:8}}><input type="number" value={from} onChange={e=>setFrom(parseInt(e.target.value)||1)} style={{flex:1,padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}/><input type="number" value={to} onChange={e=>setTo(parseInt(e.target.value)||10)} style={{flex:1,padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}/></div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12, maxHeight:500, overflow:'auto'}}>
        {Array.from({length: Math.min(50, Math.max(0,to-from+1))}, (_,i)=>{
          const n=from+i; const c=pad(n); const isAssigned = assignedSet.has(c); const data = assignedMap.get(c);
          return <div key={c} style={{background:isAssigned?'#1a1a1a':'#000',padding:8,borderRadius:10,textAlign:'center',opacity:isAssigned?0.4:1, border: isAssigned?'1px solid #333':'1px solid #111', position:'relative'}}>
            {isAssigned && <div style={{position:'absolute', top:4, left:4, background:'#ff0000', color:'#fff', fontSize:8, padding:'2px 4px', borderRadius:4}}>VENDIDO</div>}
            <div style={{background:'#fff',padding:4,borderRadius:6,display:'inline-block', marginTop:isAssigned?14:0}}><QRCodeSVG value={`${SITE}/${c}`} size={80}/></div>
            <div style={{fontSize:11,marginTop:4, textDecoration: isAssigned?'line-through': 'none', fontWeight:'bold'}}>{c} {isAssigned?` - ${data?.name}`:''}</div>
            <div style={{display:'flex', gap:4, justifyContent:'center', marginTop:4}}>
              <button disabled={isAssigned} onClick={()=>downloadQR(c,'png')} style={{fontSize:10,padding:'4px 8px',borderRadius:6,border:0,background:isAssigned?'#333':'#fff',color:isAssigned?'#777':'#000', fontWeight:'bold'}}>{isAssigned?'NO':'PNG'}</button>
              <button disabled={isAssigned} onClick={()=>downloadQR(c,'svg')} style={{fontSize:10,padding:'4px 8px',borderRadius:6,border:0,background:'#222',color:isAssigned?'#555':'#fff'}}>{isAssigned?'NO':'SVG'}</button>
            </div>
          </div>
        })}
      </div>
      <p style={{fontSize:11,opacity:0.5,marginTop:8}}>Descarga sale como tapsmza-0001.png con el codigo ya impreso abajo. Para Canva usa SVG.</p>
    </div>}

    {tab==='list' && <div style={{marginTop:20}}>
      <div style={{background:'#171717',padding:16,borderRadius:16}}>
        <h3 style={{margin:0}}>Vender / Asignar link</h3>

        <label style={{fontSize:11,opacity:0.6,marginTop:12,display:'block'}}>1. Selecciona el codigo que tenes en mano:</label>
        <select value={code} onChange={e=>setCode(e.target.value)} style={{width:'100%',padding:14,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:6}}>
          <option value="">-- Elegi uno disponible --</option>
          {Array.from({length:1000},(_,i)=>{
            const c=pad(i+1); const isAssigned = assignedSet.has(c); const data = assignedMap.get(c);
            return <option key={c} value={c} disabled={isAssigned} style={{background: isAssigned?'#333':'#000', color: isAssigned?'#777':'#fff'}}>
              {isAssigned?`❌ ${c} - VENDIDO a ${data?.name} (tachado)` : `✅ ${c} - DISPONIBLE`}
            </option>
          })}
        </select>

        {code &&!assignedSet.has(normalize(code)) && <div style={{background:'#000',border:'1px dashed #444',padding:12,borderRadius:10,marginTop:12}}>
          <div style={{fontSize:11,opacity:0.6}}>URL final para NFC Tools (copia y pega esto):</div>
          <div style={{display:'flex',gap:8,marginTop:6,alignItems:'center'}}>
            <div style={{flex:1,background:'#111',padding:10,borderRadius:8,fontSize:12,wordBreak:'break-all',fontFamily:'monospace'}}>{SITE}/{normalize(code)}</div>
            <button onClick={()=>copy(`${SITE}/${normalize(code)}`, 'nfc')} style={{padding:'10px 14px',borderRadius:8,border:0,background:copied==='nfc'?'#00ff88':'#fff',color:'#000',fontWeight:'bold'}}>{copied==='nfc'?'COPIADO!':'COPIAR'}</button>
          </div>
          <div style={{fontSize:10,opacity:0.5,marginTop:6}}>En NFC Tools: Write - Add record - URL - pega esto.</div>
        </div>}

        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre negocio (ej: Don Mario)" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:12}}/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link Google Review" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:8}}/>
        <button onClick={save} style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#fff',color:'#000',fontWeight:'bold',border:0}}>Activar Tarjeta {code?normalize(code):''}</button>
      </div>

      <div style={{marginTop:16}}>
        <h4 style={{opacity:0.7}}>CRM - Vendidas ({links.length}/1000)</h4>
        {links.map((l:any)=>(<div key={l.code} style={{background:'#171717',padding:10,borderRadius:12,marginTop:8,display:'flex',gap:10,alignItems:'center'}}>
          <div style={{background:'#fff',padding:3,borderRadius:6}}><QRCodeSVG value={`${SITE}/${l.code}`} size={36}/></div>
          <div style={{flex:1}}><b>{l.code}</b> <span style={{background:'#222',fontSize:9,padding:'2px 6px',borderRadius:10,marginLeft:6}}>VENDIDA</span><div style={{fontSize:11,opacity:0.6}}>{l.name}</div><div style={{fontSize:10,opacity:0.4, fontFamily:'monospace'}}>{SITE}/{l.code}</div></div>
          <button onClick={()=>copy(`${SITE}/${l.code}`, l.code)} style={{background:'#222',border:0,color:'#fff',padding:'8px 10px',borderRadius:8,fontSize:10}}>{copied===l.code?'COPIADO':'COPIAR URL'}</button>
        </div>))}
      </div>
    </div>}
  </div>
}
