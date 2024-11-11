import prisma from '../prisma'
import { Transaction, TransactionCategory } from '@prisma/client'

class FinancialDataService {
  async addTransaction(
    userId: string, 
    data: {
      amount: number, 
      category: TransactionCategory, 
      description?: string
    }
  ) {
    return prisma.transaction.create({
      data: {
        ...data,
        userId,
        date: new Date()
      }
    })
  }

  async getMonthlyTransactionSummary(userId: string) {
    const transactions = await prisma.transaction.groupBy({
      by: ['category'],
      where: { 
        userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: {
        amount: true
      }
    })

    return transactions
  }

  async calculateNetWorth(userId: string) {
    const financialProfile = await prisma.financialProfile.findUnique({
      where: { userId }
    })

    const totalIncome = await prisma.transaction.aggregate({
      where: { 
        userId, 
        category: TransactionCategory.INCOME 
      },
      _sum: { amount: true }
    })

    const totalExpenses = await prisma.transaction.aggregate({
      where: { 
        userId, 
        category: {
          not: TransactionCategory.INCOME
        }
      },
      _sum: { amount: true }
    })

    return {
      assets: financialProfile?.assets || 0,
      income: totalIncome._sum.amount || 0,
      expenses: totalExpenses._sum.amount || 0,
      netWorth: (financialProfile?.assets || 0) - (totalExpenses._sum.amount || 0)
    }
  }
}

export default new FinancialDataService()
