'use client'
import { useState, useEffect } from 'react'
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
  const [genCode, setGenCode] = useState('algo0011')
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(10)

  useEffect(()=>{ if(auth) fetchLinks() }, [auth])
  useEffect(()=>{ if(typeof window!=='undefined' && localStorage.getItem('taps_auth')==='1') setAuth(true) }, [])

  async function fetchLinks(){ const res = await fetch('/api/links'); setLinks(await res.json()) }
  function login(e:any){ e.preventDefault(); if(pass===ADMIN_PASS){ setAuth(true); localStorage.setItem('taps_auth','1') } else alert('Mal') }

  async function save(){ if(!code ||!url) return alert('Falta'); await fetch('/api/links',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({code:code.toLowerCase(), url, name})}); setCode(''); setUrl(''); setName(''); fetchLinks(); alert('Listo! Ahora '+code+' ya redirige') }

  function downloadQR(cod: string, format:'png'|'svg'){
    const el = document.getElementById(`qr-${cod}`)?.querySelector('svg'); if(!el) return;
    const svgData = new XMLSerializer().serializeToString(el);
    if(format==='svg'){
      const blob = new Blob([svgData],{type:'image/svg+xml'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${cod}.svg`; a.click();
    } else {
      const canvas=document.createElement('canvas'); const img=new Image(); const blob=new Blob([svgData],{type:'image/svg+xml'}); const url=URL.createObjectURL(blob);
      img.onload=()=>{ canvas.width=1000; canvas.height=1000; const ctx=canvas.getContext('2d'); ctx!.fillStyle='#fff'; ctx!.fillRect(0,0,1000,1000); ctx!.drawImage(img,0,0,1000,1000); const a=document.createElement('a'); a.download=`${cod}.png`; a.href=canvas.toDataURL(); a.click(); URL.revokeObjectURL(url) }; img.src=url;
    }
  }

  if(!auth) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0a0a0a'}}><form onSubmit={login} style={{background:'#171717',padding:32,borderRadius:24,width:320}}><h2 style={{color:'#fff'}}>TAPS Admin</h2><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="Contraseña" style={{width:'100%',padding:14,borderRadius:12,border:'1px solid #333',background:'#0a0a0a',color:'#fff',marginTop:12}}/><button style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#fff',color:'#000',fontWeight:'bold',border:0}}>Entrar</button></form></div>

  return <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#fff',padding:16,maxWidth:700,margin:'0 auto'}}>
    <h1>TAPS MZA - Panel</h1>
    <div style={{display:'flex',gap:8,marginTop:12}}><button onClick={()=>setTab('gen')} style={{flex:1,padding:12,borderRadius:12,border:0,background:tab==='gen'?'#fff':'#222',color:tab==='gen'?'#000':'#fff',fontWeight:'bold'}}>1. GENERAR QRs VÍRGENES</button><button onClick={()=>setTab('list')} style={{flex:1,padding:12,borderRadius:12,border:0,background:tab==='list'?'#fff':'#222',color:tab==='list'?'#000':'#fff',fontWeight:'bold'}}>2. LISTA / ASIGNAR</button></div>

    {tab==='gen' && <div style={{background:'#171717',padding:16,borderRadius:16,marginTop:20}}>
      <h3 style={{margin:0}}>Generador libre (no necesitas venderme nada)</h3>
      <p style={{opacity:0.6,fontSize:12}}>Acá generás QR de códigos que AÚN NO están vendidos. El QR es el mismo siempre. Imprímilo y vendelo después.</p>
      <label style={{fontSize:12,opacity:0.7}}>Un solo QR:</label>
      <div style={{display:'flex',gap:8,marginTop:6}}><input value={genCode} onChange={e=>setGenCode(e.target.value.toLowerCase())} style={{flex:1,padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}/><button onClick={()=>downloadQR('single','png')} style={{padding:'0 16px',borderRadius:10,border:0,background:'#fff',color:'#000',fontWeight:'bold'}}>PNG</button><button onClick={()=>downloadQR('single','svg')} style={{padding:'0 16px',borderRadius:10,border:0,background:'#333',color:'#fff'}}>SVG</button></div>
      <div id="qr-single" style={{textAlign:'center',marginTop:12}}><div style={{background:'#fff',display:'inline-block',padding:8,borderRadius:8}}><div id="qr-single-inner"><QRCodeSVG value={`${SITE}/${genCode}`} size={180}/></div></div><div style={{fontSize:12,opacity:0.6,marginTop:6}}>{SITE}/{genCode}</div></div>
      <div id="qr-single" style={{display:'none'}}><div id={`qr-${genCode}`}><QRCodeSVG value={`${SITE}/${genCode}`} size={1000}/></div></div>
      <div style={{display:'none'}}><div id="qr-single"><QRCodeSVG value={`${SITE}/${genCode}`} size={1000}/></div></div>

      <hr style={{margin:'20px 0',borderColor:'#222'}}/>
      <h4>Tanda para imprenta (ej: 10 tarjetas)</h4>
      <div style={{display:'flex',gap:8}}><input type="number" value={from} onChange={e=>setFrom(parseInt(e.target.value))} placeholder="Desde" style={{flex:1,padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}/><input type="number" value={to} onChange={e=>setTo(parseInt(e.target.value))} placeholder="Hasta" style={{flex:1,padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff'}}/></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12, maxHeight:400, overflow:'auto'}}>
        {Array.from({length: Math.min(50, to-from+1)}, (_,i)=>{ const n=from+i; const c=`algo${String(n).padStart(4,'0')}`; return <div key={c} style={{background:'#000',padding:8,borderRadius:10,textAlign:'center'}}><div id={`qr-${c}`} style={{background:'#fff',padding:4,borderRadius:6,display:'inline-block'}}><QRCodeSVG value={`${SITE}/${c}`} size={80}/></div><div style={{fontSize:10,marginTop:4}}>{c}</div><button onClick={()=>downloadQR(c,'png')} style={{marginTop:4,fontSize:10,padding:'4px 8px',borderRadius:6,border:0,background:'#222',color:'#fff'}}>PNG</button></div>})}
      </div>
      <p style={{fontSize:11,opacity:0.5,marginTop:8}}>Tip: Para Canva, bajá en SVG (no se pixela). Te muestra max 50 por vez para no trabar el celu, pero podés hacer de 1 a 1000 en tandas.</p>
    </div>}

    {tab==='list' && <div style={{marginTop:20}}>
      <div style={{background:'#171717',padding:16,borderRadius:16}}>
        <h3 style={{margin:0}}>Vender / Asignar link</h3>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Codigo que tenés en mano: algo0005" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:8}}/>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre negocio" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:8}}/>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Link Google Review" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #333',background:'#000',color:'#fff',marginTop:8}}/>
        <button onClick={save} style={{width:'100%',marginTop:12,padding:14,borderRadius:12,background:'#fff',color:'#000',fontWeight:'bold',border:0}}>Activar Tarjeta</button>
      </div>
      <div style={{marginTop:16}}>{links.map(l=>(<div key={l.code} style={{background:'#171717',padding:10,borderRadius:12,marginTop:8,display:'flex',gap:10,alignItems:'center'}}><div id={`qr-${l.code}`} style={{background:'#fff',padding:3,borderRadius:6}}><QRCodeSVG value={`${SITE}/${l.code}`} size={40}/></div><div style={{flex:1}}><b>{l.code}</b><div style={{fontSize:10,opacity:0.6}}>{l.name}</div></div><button onClick={()=>downloadQR(l.code,'png')} style={{background:'#222',border:0,color:'#fff',padding:6,borderRadius:6,fontSize:10}}>PNG</button></div>))}</div>
    </div>}
  </div>
}
