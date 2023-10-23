// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../config/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case 'POST':
      try {
        const { id, name, lat, lng } = req.body;
        const result = await db.query("UPDATE spots SET name = ?, lat = ?, lng = ?", [
          name,
          lat,
          lng,
          id
        ])
        return res.status(200).json(result)
      } catch (e: any) {
        return res.status(400).json({ message: e.message })
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.query;
        const result: any = await db.query("DELETE FROM spots WHERE id = ?", id)
        return res.status(200).json({id})
      } catch (e: any) {
        return res.status(400).json({ message: e.message })
      }
      break;
  }
}
