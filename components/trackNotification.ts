import notificationService from '../lib/services/notificationService'

async function getNotifications(userId: string) {
  const notifications = await notificationService.getUnreadNotifications(userId)
  // Display notifications
}
