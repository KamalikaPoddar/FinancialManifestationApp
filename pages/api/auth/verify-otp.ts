import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { identifier, otp } = req.body

    // Hardcoded OTP validation
    if (otp !== '1234') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      })
    }

    try {
      // Find user by email or phone
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: identifier },
            { phone: identifier }
          ]
        }
      })

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        })
      }

      // OTP Verified Successfully
      res.status(200).json({ 
        success: true, 
        message: 'Login Successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      })
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'OTP verification failed' 
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
