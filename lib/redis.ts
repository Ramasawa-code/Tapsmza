import { Redis } from '@upstash/redis'
let redis: Redis | null = null;
export function getRedis() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    if (!redis) redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    return redis;
  }
  return null;
}
const mem = new Map<string, any>();
export async function getLink(code: string) {
  const r = getRedis();
  if (r) { const data = await r.hgetall(`taps:${code}`); if (!data || Object.keys(data).length===0) return null; return data as any; }
  return mem.get(code) || null;
}
export async function setLink(code: string, data: any) {
  const r = getRedis();
  if (r) { await r.hset(`taps:${code}`, data); return; }
  mem.set(code, data);
}
export async function getAllLinks() {
  const r = getRedis();
  if (r) {
    const keys = await r.keys('taps:*');
    if (keys.length===0) return [];
    const pipeline = r.pipeline();
    keys.forEach(k=>pipeline.hgetall(k));
    const results = await pipeline.exec();
    return keys.map((k,i)=>({code: k.replace('taps:',''),...(results[i] as any)})).filter(x=>x.code);
  }
  return Array.from(mem.entries()).map(([code, v])=>({code,...v}));
}
export async function deleteLink(code: string) {
  const r = getRedis();
  if (r) { await r.del(`taps:${code}`); return; }
  mem.delete(code);
}
