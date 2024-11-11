// src/app/api/goals/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database/prisma'
import { z } from 'zod'

// Goal Validation Schema
const GoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  targetAmount: z.number().positive("Target amount must be positive"),
  targetDate: z.date(),
})

// CREATE Goal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = GoalSchema.parse(body)
    
    // Assuming authenticated user
    const userId = req.headers.get('user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const newGoal = await prisma.goal.create({
      data: {
        ...validatedData,
        userId,
        currentAmount: 0,
      }
    })

    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// READ Goals
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(goals)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
