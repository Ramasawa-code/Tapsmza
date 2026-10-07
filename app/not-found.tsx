import Link from 'next/link'

export default function NotFound(){
  return (
    <main className="center-screen">
      <div className="hero enter">
        <span className="pill mono">404</span>
        <h1 className="hero-heading">Esta página no existe</h1>
        <p className="lead">Revisá la dirección o volvé al inicio.</p>
        <Link href="/" className="btn btn-primary btn-lg">Volver al inicio</Link>
      </div>
    </main>
  )
}
