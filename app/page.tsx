import Link from 'next/link'

export default function Home(){
  return (
    <main className="center-screen">
      <div className="hero enter">
        <span className="pill"><span className="dot dot-live"/>Sistema de QR activo</span>
        <h1 className="wordmark hero-title">TAPS<span>MZA</span></h1>
        <p className="lead">Un toque y tus clientes llegan directo a tu reseña de Google.</p>
        <div className="chip">
          <span className="mono"><b>tapsmza.site/</b>algo0001</span>
          <span aria-hidden>→</span>
          <span>Google Reviews</span>
        </div>
        <Link href="/admin" className="btn btn-primary btn-lg">Gestionar tarjetas</Link>
      </div>
    </main>
  )
}
