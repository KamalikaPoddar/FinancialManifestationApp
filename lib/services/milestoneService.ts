import prisma from '../prisma'

interface Milestone {
  percentage: number
  message: string
}

class MilestoneService {
  private defaultMilestones: Milestone[] = [
    { percentage: 25, message: 'Quarter of the way there! Keep going!' },
    { percentage: 50, message: 'Halfway to your goal! You\'re making great progress!' },
    { percentage: 75, message: 'Almost there! Just a little more effort!' }
  ]

  async checkMilestones(goalId: string) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId }
    })

    if (!goal) return []

    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100

    return this.defaultMilestones
      .filter(milestone => 
        progressPercentage >= milestone.percentage
      )
      .map(milestone => ({
        ...milestone,
        achieved: true
      }))
  }

  async createMilestoneNotification(
    userId: string, 
    goalId: string, 
    milestone: Milestone
  ) {
    return prisma.notification.create({
      data: {
        userId,
        type: 'MILESTONE',
        message: milestone.message,
        relatedGoalId: goalId,
        read: false
      }
    })
  }
}

export default new MilestoneService()
