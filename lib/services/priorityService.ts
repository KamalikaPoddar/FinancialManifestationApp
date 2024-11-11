import prisma from '../prisma'

interface PriorityCriteria {
  timeUrgency: number
  financialImpact: number
  personalValue: number
}

class GoalPriorityService {
  async calculatePriority(goalId: string, criteria: PriorityCriteria) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId }
    })

    if (!goal) throw new Error('Goal not found')

    // Calculate time urgency
    const monthsToGoal = this.calculateMonthsToGoal(goal.deadline)
    const timeUrgencyScore = this.normalizeTimeUrgency(monthsToGoal)

    // Calculate financial impact
    const financialImpactScore = this.calculateFinancialImpact(
      goal.targetAmount, 
      goal.currentAmount
    )

    // Weighted priority calculation
    const priorityScore = 
      (timeUrgencyScore * 0.4) + 
      (financialImpactScore * 0.4) + 
      (criteria.personalValue * 0.2)

    // Update goal priority
    return prisma.goal.update({
      where: { id: goalId },
      data: { 
        priority: Math.round(priorityScore * 3) // Scale to 1-3
      }
    })
  }

  private calculateMonthsToGoal(deadline: Date): number {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    return Math.max(
      (deadlineDate.getFullYear() - now.getFullYear()) * 12 +
      (deadlineDate.getMonth() - now.getMonth()),
      1
    )
  }

  private normalizeTimeUrgency(months: number): number {
    // Normalize time urgency (closer deadline = higher score)
    return Math.min(1, 12 / months)
  }

  private calculateFinancialImpact(
    targetAmount: number, 
    currentAmount: number
  ): number {
    const progressPercentage = (currentAmount / targetAmount) * 100
    return Math.min(1, progressPercentage / 100)
  }
}

export default new GoalPriorityService()
