import { getLink } from '@/lib/redis'
import { redirect } from 'next/navigation'
export default async function CodePage({ params }: { params: { code: string } }) {
  const data = await getLink(params.code.toLowerCase());
  if (data && data.url) {
    try {
      const { getRedis } = await import('@/lib/redis');
      const r = getRedis();
      if (r) await r.hincrby(`taps:${params.code.toLowerCase()}`, 'clicks', 1);
    } catch {}
    redirect(data.url);
  }
  return (
    <div style={{display:'flex', minHeight:'100vh', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:24, textAlign:'center', background:'#0a0a0a', color:'#fff'}}>
      <h1>QR Disponible</h1>
      <p>Este codigo {params.code} aun no esta asignado.</p>
      <a href="/admin" style={{marginTop:30, background:'#fff', color:'#000', padding:'12px 24px', borderRadius:12, textDecoration:'none', fontWeight:'bold'}}>Ir al Admin</a>
    </div>
  )
}
