// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../config/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'GET':
      try {
        const results = await db.query("SELECT * FROM spots;")
        return res.status(200).json(results)
      } catch (e: any) {
        return res.status(400).json({ message: e.message })
      }
      break;
    case 'POST':
      try {
        const { id, name, lat, lng} = req.body;
        const result: any = await db.query("INSERT INTO spots SET ?", {
          name,
          lat,
          lng
        })
        return res.status(200).json({ id:result.id, name, lat, lng })
      } catch (e: any) {
        return res.status(400).json({ message: e.message })
      }
      break;
  }
}
