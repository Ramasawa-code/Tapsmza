import { Redis } from '@upstash/redis'

export function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const mem = new Map<string, any>();

export async function getLink(code: string) {
  const r = getRedis();
  if (r) {
    const data = await r.hgetall(`taps:${code}`);
    if (!data) return null;
    return data as any;
  }
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
    const out = [];
    for (const k of keys) {
      const v = await r.hgetall(k);
      if (v) out.push({ code: k.replace('taps:',''), ...v as any });
    }
    return out;
  }
  return Array.from(mem.entries()).map(([code, v]) => ({ code, ...v }));
}

export async function deleteLink(code: string) {
  const r = getRedis();
  if (r) { await r.del(`taps:${code}`); return; }
  mem.delete(code);
}
