// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import AuthService from '../../../lib/auth/authService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { user, token } = await AuthService.register(req.body)
      
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      })
    } catch (error: any) {
      res.status(400).json({ 
        message: error.message 
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// Similar implementation for login, profile, etc.
