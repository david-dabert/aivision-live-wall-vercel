import { Redis } from '@upstash/redis';
export const kv = new Redis({url:process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,token:process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN});
export const session = q => String(q.s || 'aivision-2026').replace(/[^a-zA-Z0-9_-]/g,'').slice(0,40);
export const key = (s,n) => `aivision:${s}:${n}`;
export const categories = ['Expectation','Need','Contribution','Question or concern'];
export const admin = req => req.headers['x-admin-token'] && req.headers['x-admin-token'] === process.env.ADMIN_TOKEN;
export async function state(s){return {responses:(await kv.get(key(s,'responses')))||[],clusters:(await kv.get(key(s,'clusters')))||[]};}
