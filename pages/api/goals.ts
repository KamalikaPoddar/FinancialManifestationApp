import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { title, targetAmount, deadline, priority, userId } = req.body

      const goal = await prisma.goal.create({
        data: {
          title,
          targetAmount,
          deadline: new Date(deadline),
          priority,
          userId
        }
      })

      res.status(201).json(goal)
    } catch (error) {
      res.status(500).json({ error: 'Goal creation failed' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
