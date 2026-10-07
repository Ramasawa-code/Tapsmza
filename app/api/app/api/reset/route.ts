import { getRedis } from '@/lib/redis'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')?.toLowerCase()
  const all = searchParams.get('all')
  const r = getRedis()
  if (!r) return Response.json({ error: 'No redis' }, { status: 500 })

  // ESTE ES EL QUE VAS A USAR MAÑANA: borra todo
  if (all === 'true') {
    for (let i = 1; i <= 1000; i++) {
      const c = String(i).padStart(4, '0')
      await r.hset(`taps:${c}`, { clicks: 0, qrClicks: 0 })
    }
    return Response.json({ ok: true, msg: 'Gran reset 0001-1000 hecho' })
  }

  if (!code) return Response.json({ error: 'Falta ?code=0001' }, { status: 400 })
  await r.hset(`taps:${code}`, { clicks: 0, qrClicks: 0 })
  return Response.json({ ok: true, msg: `Reset ${code} a 0` })
}
