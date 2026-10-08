import { NextRequest, NextResponse } from 'next/server'
import { listLinks, upsertLink, deleteLink } from '@/lib/links'

export async function GET(req: NextRequest) {
  try {
    const raw = parseInt(new URL(req.url).searchParams.get('page') || '1', 10)
    const data = await listLinks(Number.isNaN(raw) ? 1 : raw)
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, url, name } = await req.json()
    if (!code || !url) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    const c = String(code).toLowerCase().padStart(4, '0')
    await upsertLink(c, url, name || '')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const code = new URL(req.url).searchParams.get('code')?.toLowerCase()
    if (!code) return NextResponse.json({ ok: true })
    await deleteLink(code)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
