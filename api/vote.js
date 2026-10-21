import { kv, K, PLACES, COUNTS, COUNTRIES, isClosed } from './_vote.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  const dev = String(b.dev || ''); if (!/^[a-z0-9]{8,32}$/.test(dev)) return res.status(400).json({ error: 'Bad device id. Reload the page.' });
  const name = String(b.name || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);
  if (name.length < 1) return res.status(400).json({ error: 'Write your first name.' });
  const country = String(b.country || ''); if (!COUNTRIES.includes(country)) return res.status(400).json({ error: 'Choose your country.' });
  const picks = {}; let total = 0;
  for (const p of PLACES) { const arr = Array.isArray((b.picks || {})[p]) ? b.picks[p] : []; const nums = [...new Set(arr.map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= COUNTS[p]))].slice(0, 3).sort((x, y) => x - y); picks[p] = nums; total += nums.length; }
  if (total === 0) return res.status(400).json({ error: 'Choose at least one work.' });
  if (await isClosed()) return res.status(403).json({ closed: true, error: 'Voting is closed.' });
  await kv.hset(K.ballots, { [dev]: JSON.stringify({ name, country, picks, at: Date.now() }) });
  const voters = await kv.hlen(K.ballots);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, voters });
}
