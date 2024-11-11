// src/services/DailyFinancialPlanService.ts
import { PrismaClient } from '@prisma/client'

interface DailyFinancialPlanParams {
  userId: string
  monthlyIncome: number
  monthlyExpenses: number
  financialGoals: any[]
}

class DailyFinancialPlanService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async generateDailyFinancialPlan(params: DailyFinancialPlanParams) {
    const { 
      userId, 
      monthlyIncome, 
      monthlyExpenses, 
      financialGoals 
    } = params

    // Calculate disposable income
    const disposableIncome = monthlyIncome - monthlyExpenses

    // Prioritize goals
    const prioritizedGoals = this.prioritizeGoals(financialGoals)

    // Allocate funds to goals
    const goalAllocation = this.allocateFundsToGoals(
      disposableIncome, 
      prioritizedGoals
    )

    // Generate daily actionable insights
    const dailyInsights = this.generateDailyInsights(
      monthlyIncome, 
      monthlyExpenses, 
      goalAllocation
    )

    // Save plan to database
    await this.saveDailyPlan(userId, {
      monthlyIncome,
      monthlyExpenses,
      goalAllocation,
      dailyInsights
    })

    return {
      disposableIncome,
      goalAllocation,
      dailyInsights
    }
  }

  private prioritizeGoals(goals: any[]) {
    return goals.sort((a, b) => {
      // Priority scoring algorithm
      const getPriorityScore = (goal: any) => {
        const timeUrgency = this.calculateTimeUrgency(goal.deadline)
        const financialImpact = goal.targetAmount / 10000
        const personalValue = goal.priority || 5

        return (timeUrgency * 0.4) + 
               (financialImpact * 0.3) + 
               (personalValue * 0.3)
      }

      return getPriorityScore(b) - getPriorityScore(a)
    })
  }

  private calculateTimeUrgency(deadline: Date): number {
    const now = new Date()
    const daysToDeadline = (deadline.getTime() - now.getTime()) / 
      (1000 * 3600 * 24)
    
    // Normalize time urgency
    return Math.min(1, Math.max(0, 1 - (daysToDeadline / 365)))
  }

  private allocateFundsToGoals(
    disposableIncome: number, 
    goals: any[]
  ) {
    const allocation: any[] = []
    let remainingIncome = disposableIncome

    goals.forEach(goal => {
      const recommendedContribution = Math.min(
        goal.requiredMonthlyContribution || 
        (goal.targetAmount / goal.timeline),
        remainingIncome * 0.3 // Cap at 30% of remaining income
      )

      allocation.push({
        goalId: goal.id,
        goalTitle: goal.title,
        recommendedContribution
      })

      remainingIncome -= recommendedContribution
    })

    // Add emergency fund allocation
    allocation.push({
      goalId: 'emergency-fund',
      goalTitle: 'Emergency Fund',
      recommendedContribution: remainingIncome * 0.2
    })

    return allocation
  }

  private generateDailyInsights(
    monthlyIncome: number, 
    monthlyExpenses: number, 
    goalAllocation: any[]
  ) {
    return [
      {
        type: 'SAVINGS_RATE',
        message: `Your current savings rate is ${
          ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(2)
        }%`,
        recommendation: 'Aim to increase your savings rate to 30%'
      },
      {
        type: 'EXPENSE_TRACKING',
        message: `Your monthly expenses are ${
          (monthlyExpenses / monthlyIncome * 100).toFixed(2)
        }% of your income`,
        recommendation: 'Look for areas to reduce discretionary spending'
      },
      ...goalAllocation.map(goal => ({
        type: 'GOAL_PROGRESS',
        goalId: goal.goalId,
        message: `Recommended monthly contribution to ${goal.goalTitle}: ₹${
          goal.recommendedContribution.toFixed(2)
        }`,
        recommendation: 'Consistent contributions will help you achieve your goal'
      }))
    ]
  }

  private async saveDailyPlan(
    userId: string, 
    planDetails: any
  ) {
    return this.prisma.dailyFinancialPlan.create({
      data: {
        userId,
        planDetails: JSON.stringify(planDetails),
        date: new Date()
      }
    })
  }
}

export default new DailyFinancialPlanService()
