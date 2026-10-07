'use client'
import { useState } from 'react'

export default function LoginForm({ onLogin }: { onLogin: (pass: string) => boolean }){
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  // bumping the key remounts the card so the shake replays on every wrong attempt
  const [attempt, setAttempt] = useState(0)

  function submit(e: React.FormEvent){
    e.preventDefault()
    if(onLogin(pass)) return
    setError(true); setAttempt(a=>a+1)
  }

  return (
    <main className="center-screen">
      <form key={attempt} onSubmit={submit} className={`card login ${error ? 'shake' : 'enter'}`}>
        <div className="login-head">
          <div className="wordmark">TAPS<span>MZA</span></div>
          <p className="muted">Ingresá para gestionar tus tarjetas.</p>
        </div>
        <div className="field">
          <label className="label" htmlFor="pass">Contraseña</label>
          <input id="pass" className="input" type="password" autoComplete="current-password" autoFocus
            value={pass} onChange={e=>{ setPass(e.target.value); setError(false) }}
            aria-invalid={error} aria-describedby={error ? 'pass-error' : undefined}/>
          {error && <span id="pass-error" className="field-error" role="alert">Contraseña incorrecta.</span>}
        </div>
        <button className="btn btn-primary btn-lg btn-block" style={{marginTop:16}}>Entrar</button>
      </form>
    </main>
  )
}
