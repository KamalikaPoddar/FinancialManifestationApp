import prisma from '../prisma'

class NotificationService {
  async createGoalTrackingNotification(
    userId: string, 
    goalId: string, 
    type: 'PROGRESS' | 'MILESTONE' | 'REMINDER'
  ) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId }
    })

    if (!goal) throw new Error('Goal not found')

    const messageTemplates = {
      PROGRESS: `You're making progress on your goal: ${goal.title}`,
      MILESTONE: `Congratulations! You've reached a milestone for ${goal.title}`,
      REMINDER: `Reminder: Stay focused on your goal ${goal.title}`
    }

    return prisma.notification.create({
      data: {
        userId,
        type,
        message: messageTemplates[type],
        relatedGoalId: goalId,
        read: false
      }
    })
  }

  async getUnreadNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { 
        userId, 
        read: false 
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async markNotificationAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    })
  }
}

export default new NotificationService()
