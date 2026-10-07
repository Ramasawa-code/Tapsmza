import { NextRequest, NextResponse } from 'next/server'

// Usamos el mismo store que ya tenés (KV / archivo / memoria)
let linksStore: any[] = [] // si usas KV, no toques esa parte, solo el GET

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const reset = searchParams.get('reset')

  // --- FIX DEFINITIVO DEL RESET ---
  if (reset) {
    // CASO 1: reset=all -> BORRA TODO, no crea 1000
    if (reset === 'all') {
      // Si usas Vercel KV / Redis:
      // await kv.del('taps_links')
      // Si usas archivo json:
      linksStore = []
      // Si usas tu lógica actual, reemplaza por esto:
      // await db.deleteAll() o lo que tengas

      // Guardado en archivo si usas fs
      try {
        const fs = require('fs')
        const path = require('path')
        const file = path.join(process.cwd(), 'data', 'links.json')
        if (fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]))
      } catch {}

      return NextResponse.json({ ok: true, msg: 'TODO BORRADO - 0 vendidas' })
    }
    
    // CASO 2: reset=0001 -> borra solo esa
    const code = reset.toLowerCase().padStart(4,'0')
    linksStore = linksStore.filter((l:any) => l.code !== code)
    try {
      const fs = require('fs')
      const path = require('path')
      const file = path.join(process.cwd(), 'data', 'links.json')
      if (fs.existsSync(file)) {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'))
        const filtrado = data.filter((l:any) => l.code !== code && l.code !== reset)
        fs.writeFileSync(file, JSON.stringify(filtrado))
      }
    } catch {}

    return NextResponse.json({ ok: true, msg: `Borrada ${code}` })
  }

  // tu GET normal de siempre
  try {
    const fs = require('fs')
    const path = require('path')
    const file = path.join(process.cwd(), 'data', 'links.json')
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      return NextResponse.json(data)
    }
  } catch {}
  
  return NextResponse.json(linksStore)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code, url, name } = body
  
  let current: any[] = []
  try {
    const fs = require('fs')
    const path = require('path')
    const file = path.join(process.cwd(), 'data', 'links.json')
    const dir = path.dirname(file)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true})
    if (fs.existsSync(file)) current = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch { current = linksStore }

  const exists = current.find((l:any) => l.code === code)
  if (exists) {
    exists.url = url
    exists.name = name
  } else {
    current.push({ code, url, name, clicks: 0, qrClicks: 0 })
  }

  try {
    const fs = require('fs')
    const path = require('path')
    const file = path.join(process.cwd(), 'data', 'links.json')
    fs.writeFileSync(file, JSON.stringify(current, null, 2))
  } catch { linksStore = current }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.json({ error: 'falta code' }, { status: 400 })

  try {
    const fs = require('fs')
    const path = require('path')
    const file = path.join(process.cwd(), 'data', 'links.json')
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      const filtrado = data.filter((l:any) => l.code !== code)
      fs.writeFileSync(file, JSON.stringify(filtrado, null, 2))
    }
  } catch {}
  
  linksStore = linksStore.filter((l:any) => l.code !== code)
  return NextResponse.json({ ok: true })
}
