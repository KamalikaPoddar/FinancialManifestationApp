// lib/middleware/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next'
import AuthService from '../auth/authService'

export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    try {
      const decoded = await AuthService.verifyToken(token)
      req.user = decoded
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
  }
}
