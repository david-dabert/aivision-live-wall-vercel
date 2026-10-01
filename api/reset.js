import { kv,session,key,admin } from './_lib.js';
export default async function handler(req,res){if(req.method!=='POST')return res.status(405).end();if(!admin(req))return res.status(401).json({error:'Facilitator access required.'});const s=session(req.query);await kv.del(key(s,'responses'),key(s,'clusters'));res.status(200).json({ok:true});}
