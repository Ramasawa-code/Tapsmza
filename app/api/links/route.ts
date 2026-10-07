import { NextRequest, NextResponse } from 'next/server'

const FILE = '/tmp/links.json'

function load() {
  try {
    const fs = require('fs')
    if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, 'utf8'))
  } catch {}
  return []
}
function save(data: any) {
  try {
    const fs = require('fs')
    fs.writeFileSync(FILE, JSON.stringify(data))
  } catch {}
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reset = searchParams.get('reset')
    let data = load()

    if (reset) {
      if (reset === 'all') {
        data = data.map((l: any) => ({...l, clicks: 0, qrClicks: 0 }))
        save(data)
        return NextResponse.json({ ok: true, msg: 'Contadores en 0' })
      } else {
        const code = reset.padStart(4, '0')
        data = data.map((l: any) => l.code === code? {...l, clicks: 0, qrClicks: 0 } : l)
        save(data)
        return NextResponse.json({ ok: true, msg: `Contador ${code} en 0` })
      }
    }
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, name, code } = await req.json()
    let data = load()
    const i = data.findIndex((l: any) => l.code === code)
    if (i >= 0) { data[i].url = url; data[i].name = name }
    else { data.push({ code, url, name, clicks: 0, qrClicks: 0 }) }
    save(data)
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const code = new URL(req.url).searchParams.get('code')
    let data = load()
    data = data.filter((l: any) => l.code!== code)
    save(data)
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}
