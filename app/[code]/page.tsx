import { getLink, incrementCounter } from '@/lib/links'
import { redirect } from 'next/navigation'

export default async function CodePage({
  params,
  searchParams
}: {
  params: { code: string },
  searchParams?: { s?: string, src?: string }
}) {
  const code = params.code.toLowerCase()

  let data = null
  try {
    data = await getLink(code)
  } catch {
    // A transient DB error shouldn't 500 a customer tap; treat as unassigned.
    data = null
  }

  if (data && data.url) {
    try {
      const isQR = searchParams?.s === 'qr' || searchParams?.src === 'qr'
      await incrementCounter(code, isQR)
    } catch {}
    redirect(data.url)
  }

  return (
    <main className="center-screen">
      <div className="hero enter">
        <span className="pill"><span className="dot"/>Sin asignar</span>
        <h1 className="hero-heading">QR disponible</h1>
        <span className="code-badge mono">{params.code}</span>
        <p className="lead">Este código aún no está asignado a ningún negocio.</p>
        <a href="/admin" className="btn btn-primary btn-lg">Ir al Admin</a>
      </div>
    </main>
  )
}
