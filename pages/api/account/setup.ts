import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get session and ensure user is authenticated
  const session = await getSession({ req })
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'POST') {
    try {
      const { 
        monthlyIncome, 
        occupation, 
        financialGoals, 
        userId 
      } = req.body

      // Update or create user profile
      const userProfile = await prisma.user.update({
        where: { id: userId },
        data: {
          profile: {
            upsert: {
              create: {
                monthlyIncome: parseFloat(monthlyIncome),
                occupation,
                financialGoals
              },
              update: {
                monthlyIncome: parseFloat(monthlyIncome),
                occupation,
                financialGoals
              }
            }
          }
        }
      })

      res.status(200).json({ 
        message: 'Profile setup successful', 
        profile: userProfile 
      })
    } catch (error) {
      console.error('Account setup error:', error)
      res.status(500).json({ 
        error: 'Account setup failed', 
        details: error 
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
