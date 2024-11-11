import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import GoalCard from './GoalCard'

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  timeline: number // in months
  priority: number
}

export default function ManifestationBoard() {
  const { data: session } = useSession()
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    async function fetchUserGoals() {
      if (session?.user) {
        try {
          const response = await fetch(`/api/goals/${session.user.id}`)
          const userGoals = await response.json()
          setGoals(userGoals)
        } catch (error) {
          console.error('Failed to fetch goals', error)
        }
      }
    }

    fetchUserGoals()
  }, [session])

  if (goals.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">
        Your Manifestation Board
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  )
}
