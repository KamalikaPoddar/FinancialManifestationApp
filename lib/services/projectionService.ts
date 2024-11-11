import prisma from '../prisma'

class FinancialProjectionService {
  async generateProjection(goalId: string) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { user: { include: { profile: true } } }
    })

    if (!goal) throw new Error('Goal not found')

    const monthlyIncome = goal.user.profile?.monthlyIncome || 0
    const monthsToGoal = this.calculateMonthsToGoal(goal.deadline)

    // Conservative Projection
    const conservativeProjection = this.calculateProjection(
      goal.targetAmount, 
      monthlyIncome, 
      monthsToGoal, 
      0.05 // 5% conservative growth
    )

    // Moderate Projection
    const moderateProjection = this.calculateProjection(
      goal.targetAmount, 
      monthlyIncome, 
      monthsToGoal, 
      0.10 // 10% moderate growth
    )

    // Aggressive Projection
    const aggressiveProjection = this.calculateProjection(
      goal.targetAmount, 
      monthlyIncome, 
      monthsToGoal, 
      0.15 // 15% aggressive growth
    )

    return {
      conservative: conservativeProjection,
      moderate: moderateProjection,
      aggressive: aggressiveProjection
    }
  }

  private calculateProjection(
    targetAmount: number, 
    monthlyIncome: number, 
    months: number, 
    growthRate: number
  ) {
    const monthlySavings = monthlyIncome * 0.2 // Assume 20% savings
    const totalSavings = monthlySavings * months
    const investmentGrowth = totalSavings * (1 + growthRate)

    return {
      targetAmount,
      monthlySavings,
      totalSavings,
      investmentGrowth,
      remainingGap: Math.max(0, targetAmount - investmentGrowth)
    }
  }

  private calculateMonthsToGoal(deadline: Date): number {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const months = (deadlineDate.getFullYear() - now.getFullYear()) * 12 +
                   (deadlineDate.getMonth() - now.getMonth())
    return Math.max(months, 1)
  }
}

export default new FinancialProjectionService()
