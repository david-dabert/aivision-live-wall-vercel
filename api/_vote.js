import { Redis } from '@upstash/redis';
export const kv = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN });
export const K = { ballots: 'aivision:vote:ballots', state: 'aivision:vote:state' };
export const PLACES = ["Door", "Gate", "Rooftops", "Street", "River", "Towers"];
export const COUNTS = {"Door": 10, "Gate": 6, "Rooftops": 4, "Street": 6, "River": 4, "Towers": 7};
export const COUNTRIES = ["France", "Italy", "Lithuania", "Poland", "Romania"];
export const CLOSE_AT = process.env.VOTE_CLOSE_AT || '2026-10-21T10:15:00Z';
export async function isClosed() {
  const st = await kv.get(K.state);
  if (st === 'closed') return true;
  if (st === 'open') return false;
  return Date.now() >= Date.parse(CLOSE_AT);
}
export function parseBallot(v) { try { return typeof v === 'string' ? JSON.parse(v) : v; } catch (e) { return null; } }
export async function allBallots() {
  const h = (await kv.hgetall(K.ballots)) || {};
  return Object.entries(h).map(([dev, v]) => ({ dev, ...(parseBallot(v) || {}) })).filter(b => b.name && b.picks).sort((a, b) => (a.at || 0) - (b.at || 0));
}
export const adminOk = t => t && ((process.env.VOTE_ADMIN && t === process.env.VOTE_ADMIN) || (process.env.ADMIN_TOKEN && t === process.env.ADMIN_TOKEN));
