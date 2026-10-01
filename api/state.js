import { session, state } from './_lib.js';
export default async function handler(req,res){res.status(200).json({...await state(session(req.query)),aiReady:Boolean(process.env.GEMINI_API_KEY||process.env.OPENAI_API_KEY)});}
