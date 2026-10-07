import { getAllLinks, setLink, deleteLink } from '@/lib/redis'
import { getRedis } from '@/lib/redis'

export async function GET(req: Request){ 
  const { searchParams } = new URL(req.url);
  const reset = searchParams.get('reset');

  // SI PONES ?reset=all HACE EL GRAN RESET
  if (reset === 'all') {
    const r = getRedis();
    if (r) {
      for (let i = 1; i <= 1000; i++) {
        const c = String(i).padStart(4, '0')
        await r.hset(`taps:${c}`, { clicks: 0, qrClicks: 0 })
      }
    }
    return Response.json({ ok: true, msg: 'Gran reset 0001-1000 hecho' });
  }

  // SI PONES ?reset=0001 RESETEA SOLO ESE
  if (reset) {
    const r = getRedis();
    if (r) await r.hset(`taps:${reset.toLowerCase()}`, { clicks: 0, qrClicks: 0 })
    return Response.json({ ok: true, msg: `Reset ${reset} a 0` });
  }

  const links = await getAllLinks(); 
  return Response.json(links.sort((a:any,b:any)=>a.code.localeCompare(b.code))); 
}

export async function POST(req: Request){ 
  const { code, url, name } = await req.json(); 
  if(!code ||!url) return Response.json({error:'faltan datos'}, {status:400}); 
  await setLink(code.toLowerCase().trim(), { 
    url, 
    name: name||'', 
    createdAt: new Date().toISOString(), 
    clicks: 0,
    qrClicks: 0
  }); 
  return Response.json({ok:true}); 
}

export async function DELETE(req: Request){ 
  const { searchParams } = new URL(req.url); 
  const code = searchParams.get('code'); 
  if(!code) return Response.json({error:'falta code'}, {status:400}); 
  await deleteLink(code.toLowerCase().trim()); 
  return Response.json({ok:true, code}); 
}
