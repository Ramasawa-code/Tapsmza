import { getLink, incrementCounter } from '@/lib/links'
import { redirect } from 'next/navigation'

export default async function CodePage({
  params,
  searchParams
}: {
  params: Promise<{ code: string }>,
  searchParams: Promise<{ s?: string, src?: string }>
}) {
  const { code: rawCode } = await params
  const { s, src } = await searchParams
  const code = rawCode.toLowerCase()

  let data = null
  let lookupFailed = false
  try {
    data = await getLink(code)
  } catch (error) {
    // A transient DB error shouldn't 500 a customer tap, but it must not be
    // reported as "unassigned" either: log it and show a retry state instead.
    console.error(`[code] getLink failed for "${code}"`, error)
    lookupFailed = true
  }

  if (data && data.url) {
    try {
      const isQR = s === 'qr' || src === 'qr'
      await incrementCounter(code, isQR)
    } catch (error) {
      // Never block the redirect on a counter failure, but don't hide it.
      console.error(`[code] incrementCounter failed for "${code}"`, error)
    }
    redirect(data.url)
  }

  if (lookupFailed) {
    return (
      <main className="center-screen">
        <div className="hero enter">
          <span className="pill"><span className="dot dot-down"/>Error temporal</span>
          <h1 className="hero-heading">No pudimos cargar el enlace</h1>
          <span className="code-badge mono">{rawCode}</span>
          <p className="lead">Hubo un problema al buscar este código. Probá de nuevo en unos segundos.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="center-screen">
      <div className="hero enter">
        <span className="pill"><span className="dot"/>Sin asignar</span>
        <h1 className="hero-heading">QR disponible</h1>
        <span className="code-badge mono">{rawCode}</span>
        <p className="lead">Este código aún no está asignado a ningún negocio.</p>
        <a href="/admin" className="btn btn-primary btn-lg">Ir al Admin</a>
      </div>
    </main>
  )
}
