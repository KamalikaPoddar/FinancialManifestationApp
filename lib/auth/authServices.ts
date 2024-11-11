// lib/auth/authService.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Validation Schemas
const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

class AuthService {
  // User Registration
  async register(userData: z.infer<typeof RegisterSchema>) {
    // Validate input
    const validatedData = RegisterSchema.parse(userData)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword
      }
    })

    // Generate JWT
    const token = this.generateToken(user)

    return { user, token }
  }

  // User Login
  async login(credentials: z.infer<typeof LoginSchema>) {
    const validatedData = LoginSchema.parse(credentials)

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isValidPassword = await bcrypt.compare(
      validatedData.password, 
      user.password || ''
    )

    if (!isValidPassword) {
      throw new Error('Invalid credentials')
    }

    const token = this.generateToken(user)

    return { user, token }
  }

  // Token Generation
  private generateToken(user: any) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    )
  }

  // Token Verification Middleware
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      return decoded
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }
}

export default new AuthService()
