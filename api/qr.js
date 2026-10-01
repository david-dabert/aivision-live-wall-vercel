import QRCode from 'qrcode';
export default async function handler(req,res){const url=String(req.query.url||'').slice(0,500);if(!url.startsWith('http'))return res.status(400).end();const png=await QRCode.toBuffer(url,{width:340,margin:1,color:{dark:'#080d38',light:'#ffffff'}});res.setHeader('Content-Type','image/png');res.status(200).send(png);}
