import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { userId } = req.query

  if (req.method === 'GET') {
    try {
      const goals = await prisma.goal.findMany({
        where: { 
          userId: userId as string,
          status: 'ACTIVE' // Only active goals
        },
        select: {
          id: true,
          title: true,
          targetAmount: true,
          currentAmount: true,
          deadline: true
        }
      })

      // Transform goals to include timeline
      const transformedGoals = goals.map(goal => ({
        ...goal,
        timeline: Math.ceil(
          (new Date(goal.deadline).getTime() - new Date().getTime()) 
          / (1000 * 60 * 60 * 24 * 30)
        )
      }))

      res.status(200).json(transformedGoals)
    } catch (error) {
      console.error('Failed to fetch goals', error)
      res.status(500).json({ error: 'Failed to fetch goals' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
