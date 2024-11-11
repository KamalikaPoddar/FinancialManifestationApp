import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { identifier } = req.body

    try {
      // Check if identifier is email or mobile
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { phone: identifier }
          ]
        }
      })

      if (user) {
        res.status(200).json({ exists: true })
      } else {
        res.status(200).json({ exists: false })
      }
    } catch (error) {
      res.status(500).json({ error: 'User verification failed' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
