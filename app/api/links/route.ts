import { getAllLinks, setLink, deleteLink } from '@/lib/redis'

export async function GET(){ 
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
    clicks: 0 
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
