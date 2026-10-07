import { getLink } from '@/lib/redis'
import { redirect } from 'next/navigation'

export default async function CodePage({
  params,
  searchParams
}: {
  params: { code: string },
  searchParams?: { s?: string, src?: string }
}) {
  const code = params.code.toLowerCase()
  const data = await getLink(code);

  if (data && data.url) {
    try {
      const { getRedis } = await import('@/lib/redis');
      const r = getRedis();
      if (r) {
        const isQR = searchParams?.s === 'qr' || searchParams?.src === 'qr'
        if (isQR) {
          await r.hincrby(`taps:${code}`, 'qrClicks', 1);
        } else {
          await r.hincrby(`taps:${code}`, 'clicks', 1);
        }
      }
    } catch {}
    redirect(data.url);
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
