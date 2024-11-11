// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database/prisma'
import { z } from 'zod'

const TransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  category: z.string(),
  description: z.string().optional(),
  goalId: z.string().optional(),
  date: z.date().optional()
})

// CREATE Transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = TransactionSchema.parse(body)
    
    const userId = req.headers.get('user-id')
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        userId,
        date: validatedData.date || new Date()
      }
    })

    // If transaction is linked to a goal, update goal progress
    if (validatedData.goalId) {
      await prisma.goal.update({
        where: { id: validatedData.goalId },
        data: {
          currentAmount: {
            increment: validatedData.type === 'INCOME' 
              ? validatedData.amount 
              : -validatedData.amount
          }
        }
      })
    }

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
