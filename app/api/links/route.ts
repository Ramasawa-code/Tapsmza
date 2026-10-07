import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  try {
    const r = getRedis()
    if (!r) return NextResponse.json([])
    const { searchParams } = new URL(req.url)
    const reset = searchParams.get('reset')

    if (reset) {
      if (reset === 'all') {
        const keys = await r.keys('taps:*')
        for (const k of keys) {
          await r.hset(k, { clicks: 0, qrClicks: 0 })
        }
        return NextResponse.json({ ok: true, msg: 'RESET ALL - contadores en 0, vendidas intactas' })
      } else {
        const code = reset.toLowerCase().padStart(4, '0')
        await r.hset(`taps:${code}`, { clicks: 0, qrClicks: 0 })
        return NextResponse.json({ ok: true, msg: `RESET ${code} en 0` })
      }
    }

    const keys = await r.keys('taps:*')
    const result = []
    for (const k of keys) {
      const data: any = await r.hgetall(k)
      if (data && data.url) {
        const code = k.replace('taps:', '')
        result.push({
          code,
          url: data.url,
          name: data.name || '',
          clicks: parseInt(data.clicks || '0'),
          qrClicks: parseInt(data.qrClicks || '0'),
        })
      }
    }
    result.sort((a,b) => a.code.localeCompare(b.code))
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const r = getRedis()
    if (!r) return NextResponse.json({ error: 'no redis' }, { status: 500 })
    const { code, url, name } = await req.json()
    const c = code.toLowerCase().padStart(4, '0')
    const existing: any = await r.hgetall(`taps:${c}`) || {}
    await r.hset(`taps:${c}`, { 
      url, 
      name, 
      clicks: existing.clicks || 0, 
      qrClicks: existing.qrClicks || 0 
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const r = getRedis()
    const code = new URL(req.url).searchParams.get('code')?.toLowerCase()
    if (!r || !code) return NextResponse.json({ ok: true })
    await r.del(`taps:${code}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
