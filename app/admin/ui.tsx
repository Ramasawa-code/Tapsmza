'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export function Spinner({ large }: { large?: boolean }){
  return <span className={large ? 'spinner spinner-lg' : 'spinner'} aria-hidden/>
}

export function Splash(){
  return (
    <div className="center-screen" role="status">
      <Spinner large/>
      <span className="sr-only">Cargando…</span>
    </div>
  )
}

export type ToastKind = 'success' | 'error'
export type PushToast = (kind: ToastKind, title: string, body?: string) => void
type Toast = { id: number, kind: ToastKind, title: string, body?: string }

export function useToasts(){
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)
  const push: PushToast = useCallback((kind, title, body)=>{
    const id = nextId.current++
    setToasts(t=>[...t.slice(-2), { id, kind, title, body }])
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 4500)
  }, [])
  return { toasts, push }
}

export function Toasts({ toasts }: { toasts: Toast[] }){
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map(t=>(
        <div key={t.id} className={`toast toast-${t.kind}`}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="9" cy="9" r="7.25"/>
            {t.kind==='success' ? <path d="m6 9.25 2 2 4-4.5"/> : <path d="M9 5.5v4M9 12.25v.01"/>}
          </svg>
          <div><strong>{t.title}</strong>{t.body && <p>{t.body}</p>}</div>
        </div>
      ))}
    </div>
  )
}

export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }: {
  open: boolean, title: string, body: string, confirmLabel: string, onConfirm: () => void, onCancel: () => void
}){
  const ref = useRef<HTMLDialogElement>(null)

  // Native modal <dialog>: focus trap and backdrop come for free
  useEffect(()=>{
    const d = ref.current
    if(!d) return
    if(open && !d.open) d.showModal()
    if(!open && d.open) d.close()
  }, [open])

  useEffect(()=>{
    const d = ref.current
    if(!d) return
    const onEsc = (e: Event) => { e.preventDefault(); onCancel() }
    d.addEventListener('cancel', onEsc)
    return () => d.removeEventListener('cancel', onEsc)
  }, [onCancel])

  return (
    <dialog ref={ref} className="dialog" onClick={e=>{ if(e.target===ref.current) onCancel() }}>
      <div className="dialog-body">
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="button" className="btn btn-danger-solid" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </dialog>
  )
}
