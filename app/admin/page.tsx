'use client'
import { useState, useEffect, useMemo } from 'react'
import { useLinks, type TapLink } from './useLinks'
import { Splash, Toasts, useToasts } from './ui'
import LoginForm from './LoginForm'
import GeneratorTab from './GeneratorTab'
import AssignTab from './AssignTab'

const ADMIN_PASS = 'TAPSWIN2026!'

export default function Admin(){
  // null until localStorage has been read, so the login form never flashes for a logged-in user
  const [auth, setAuth] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'gen'|'list'>('gen')
  const { links, status, stale, refresh } = useLinks(auth === true)
  const { toasts, push } = useToasts()

  useEffect(()=>{
    let stored = false
    try { stored = localStorage.getItem('taps_auth')==='1' } catch {}
    setAuth(stored)
  }, [])

  function login(pass: string){
    if(pass!==ADMIN_PASS) return false
    setAuth(true)
    try { localStorage.setItem('taps_auth','1') } catch {}
    return true
  }

  const assignedMap = useMemo(()=>{ const m=new Map<string, TapLink>(); links.forEach(l=>m.set(l.code.toLowerCase(), l)); return m }, [links])

  if(auth===null) return <Splash/>
  if(!auth) return <LoginForm onLogin={login}/>

  const live = status==='ready' && !stale
  const connection = live ? 'En vivo' : status==='loading' ? 'Conectando…' : 'Sin conexión'

  return (
    <main className="shell">
      <header className="topbar">
        <div className="topbar-brand"><h1 className="wordmark">TAPS<span>MZA</span></h1><small>Panel</small></div>
        <span className="pill" role="status"><span className={`dot${live?' dot-live':status==='loading'?'':' dot-down'}`}/>{connection}</span>
      </header>

      <div className="tabs" role="tablist">
        <button type="button" role="tab" id="tab-gen" aria-controls="panel-gen" aria-selected={tab==='gen'} className="tab" onClick={()=>setTab('gen')}><span className="tab-step">1</span>Generar QRs</button>
        <button type="button" role="tab" id="tab-list" aria-controls="panel-list" aria-selected={tab==='list'} className="tab" onClick={()=>setTab('list')}><span className="tab-step">2</span>Vender / Asignar</button>
      </div>

      {/* Both panels stay mounted so form inputs survive a tab switch */}
      <section role="tabpanel" id="panel-gen" aria-labelledby="tab-gen" className="panel" hidden={tab!=='gen'}>
        <GeneratorTab assignedMap={assignedMap} toast={push}/>
      </section>
      <section role="tabpanel" id="panel-list" aria-labelledby="tab-list" className="panel" hidden={tab!=='list'}>
        <AssignTab links={links} status={status} assignedMap={assignedMap} refresh={refresh} toast={push}/>
      </section>

      <Toasts toasts={toasts}/>
    </main>
  )
}
