import { kv, K, adminOk, allBallots } from './_vote.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { token, action } = req.body || {};
  if (!adminOk(token)) return res.status(401).json({ error: 'Wrong key.' });
  res.setHeader('Cache-Control', 'no-store');
  if (action === 'close' || action === 'open' || action === 'auto') { const st = action === 'close' ? 'closed' : action; await kv.set(K.state, st); return res.status(200).json({ ok: true, state: st }); }
  if (action === 'export') return res.status(200).json({ ok: true, ballots: await allBallots() });
  if (action === 'reset') { const n = await kv.exists(K.ballots); if (n) await kv.rename(K.ballots, K.ballots + ':bak:' + Date.now()); return res.status(200).json({ ok: true, state: 'reset' }); }
  return res.status(400).json({ error: 'Unknown action.' });
}
