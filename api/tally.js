import { PLACES, COUNTS, CLOSE_AT, isClosed, allBallots } from './_vote.js';
export default async function handler(req, res) {
  const closed = await isClosed();
  const ballots = await allBallots();
  const light = 'light' in (req.query || {});
  const out = { closed, closeAt: CLOSE_AT, voters: ballots.length, at: Date.now() };
  if (!light) {
    const tally = {}; const byCountry = {};
    for (const p of PLACES) { tally[p] = {}; for (let i = 1; i <= COUNTS[p]; i++) tally[p][i] = 0; }
    for (const b of ballots) { byCountry[b.country] = (byCountry[b.country] || 0) + 1; for (const p of PLACES) for (const n of (b.picks[p] || [])) if (tally[p][n] !== undefined) tally[p][n]++; }
    out.tally = tally; out.byCountry = byCountry;
    if ('who' in (req.query || {})) out.voterList = ballots.map(b => ({ name: b.name, country: b.country, at: b.at }));
  }
  res.setHeader('Cache-Control', 'public, s-maxage=3, stale-while-revalidate=10');
  return res.status(200).json(out);
}
