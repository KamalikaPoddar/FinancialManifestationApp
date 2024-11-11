import priorityService from '../lib/services/priorityService'

async function updateGoalPriority(goalId: string) {
  const updatedGoal = await priorityService.calculatePriority(goalId, {
    timeUrgency: 0.8,
    financialImpact: 0.6,
    personalValue: 0.9
  })
}
