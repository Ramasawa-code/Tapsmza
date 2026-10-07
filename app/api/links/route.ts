import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const reset = searchParams.get('reset')
  const cleanFake = searchParams.get('cleanFake')

  const getFile = () => {
    try {
      const fs = require('fs')
      const path = require('path')
      const file = path.join(process.cwd(), 'data', 'links.json')
      if (fs.existsSync(file)) return { fs, file, data: JSON.parse(fs.readFileSync(file, 'utf8')) }
    } catch {}
    return { fs: null, file: null, data: [] }
  }

  // LIMPIADOR SEGURO - SOLO BORRA LAS TRUCHAS, DEJA 0001-0004
  if (cleanFake === 'true') {
    const { fs, file, data } = getFile()
    const keep = ['0001','0002','0003','0004']
    const filtrado = data.filter((l:any) => keep.includes(l.code))
    if (fs && file) fs.writeFileSync(file, JSON.stringify(filtrado, null, 2))
    return NextResponse.json({ ok: true, msg: `LIMPIEZA OK - Quedan solo ${filtrado.length}`, kept: filtrado })
  }

  // RESET TOTAL DESACTIVADO PARA SEGURIDAD
  if (reset === 'all') {
    return NextResponse.json({ error: 'RESET ALL DESACTIVADO por seguridad. Usa cleanFake=true' }, { status: 403 })
  }
  if (reset) {
    const { fs, file, data } = getFile()
    const code = reset.toLowerCase().padStart(4,'0')
    if (['0001','0002','0003','0004'].includes(code)) {
      return NextResponse.json({ error: `No se puede borrar ${code} - está protegida` }, { status: 403 })
    }
    const filtrado = data.filter((l:any) => l.code !== code)
    if (fs && file) fs.writeFileSync(file, JSON.stringify(filtrado, null, 2))
    return NextResponse.json({ ok: true, msg: `Borrada ${code}` })
  }

  const { data } = getFile()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code, url, name } = body
  const fs = require('fs')
  const path = require('path')
  const file = path.join(process.cwd(), 'data', 'links.json')
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
  let current: any[] = []
  if (fs.existsSync(file)) current = JSON.parse(fs.readFileSync(file, 'utf8'))
  const exists = current.find((l:any) => l.code === code)
  if (exists) { exists.url = url; exists.name = name }
  else { current.push({ code, url, name, clicks: 0, qrClicks: 0 }) }
  fs.writeFileSync(file, JSON.stringify(current, null, 2))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'falta code' }, { status: 400 })
  if (['0001','0002','0003','0004'].includes(code)) {
    return NextResponse.json({ error: `No se puede desactivar ${code} - protegida` }, { status: 403 })
  }
  const fs = require('fs')
  const path = require('path')
  const file = path.join(process.cwd(), 'data', 'links.json')
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const filtrado = data.filter((l:any) => l.code !== code)
    fs.writeFileSync(file, JSON.stringify(filtrado, null, 2))
  }
  return NextResponse.json({ ok: true })
}
