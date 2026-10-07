import { NextRequest, NextResponse } from 'next/server'

function getStore() {
  const fs = require('fs')
  const path = require('path')
  const file = path.join(process.cwd(), 'data', 'links.json')
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  let data: any[] = []
  if (fs.existsSync(file)) {
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { data = [] }
  }
  return { fs, file, data }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const reset = searchParams.get('reset')
  const cleanFake = searchParams.get('cleanFake')

  // 1. LIMPIAR LAS 996 TRUCHAS (deja solo 0001-0004)
  if (cleanFake === 'true') {
    const { fs, file, data } = getStore()
    const keep = ['0001', '0002', '0003', '0004']
    const filtrado = data.filter((l: any) => keep.includes(l.code))
    fs.writeFileSync(file, JSON.stringify(filtrado, null, 2))
    return NextResponse.json({ ok: true, msg: `LIMPIADO - Quedan ${filtrado.length} (0001-0004)`, data: filtrado })
  }

  // 2. RESET = PONER EN 0 LOS CONTADORES (NO BORRA)
  if (reset) {
    const { fs, file, data } = getStore()
    if (reset === 'all') {
      const reseteado = data.map((l: any) => ({ ...l, clicks: 0, qrClicks: 0 }))
      fs.writeFileSync(file, JSON.stringify(reseteado, null, 2))
      return NextResponse.json({ ok: true, msg: 'RESET ALL OK - Todos los contadores en 0, vendidas intactas' })
    } else {
      const code = reset.toLowerCase().padStart(4, '0')
      const reseteado = data.map((l: any) => l.code === code ? { ...l, clicks: 0, qrClicks: 0 } : l)
      fs.writeFileSync(file, JSON.stringify(reseteado, null, 2))
      return NextResponse.json({ ok: true, msg: `RESET ${code} OK - Contador en 0` })
    }
  }

  const { data } = getStore()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { fs, file, data } = getStore()
  const { code, url, name } = body
  const exists = data.find((l: any) => l.code === code)
  if (exists) {
    exists.url = url
    exists.name = name
  } else {
    data.push({ code, url, name, clicks: 0, qrClicks: 0 })
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const { fs, file, data } = getStore()
  const filtrado = data.filter((l: any) => l.code !== code)
  fs.writeFileSync(file, JSON.stringify(filtrado, null, 2))
  return NextResponse.json({ ok: true })
}
