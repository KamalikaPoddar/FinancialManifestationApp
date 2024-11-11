// src/components/features/GoalManager.tsx
'use client'

import { useState, useEffect } from 'react'
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle 
} from 'react-icons/fa'
import { Button } from '@/components/ui'
import GoalProgressChart from './GoalProgressChart'

interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
}

export default function GoalManager() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Fetch Goals
  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch('/api/goals')
        const data = await response.json()
        setGoals(data)
      } catch (error) {
        console.error('Failed to fetch goals', error)
      }
    }
    fetchGoals()
  }, [])

  // Goal Progress Calculation
  const calculateProgress = (goal: Goal) => {
    return Math.round((goal.currentAmount / goal.targetAmount) * 100)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Financial Goals</h2>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          variant="default"
          size="default"
          icon={<FaPlus />}
        >
          Add New Goal
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div 
            key={goal.id} 
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{goal.title}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>

            <GoalProgressChart 
              targetAmount={goal.targetAmount}
              currentAmount={goal.currentAmount}
            />

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-600">
                  Target: ${goal.targetAmount.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-600">
                  Current: ${goal.currentAmount.toLocaleString()}
                </p>
              </div>
              <div 
                className={`
                  flex items-center text-sm font-medium
                  ${goal.status === 'COMPLETED' 
                    ? 'text-green-600' 
                    : 'text-blue-600'}
                `}
              >
                {goal.status === 'COMPLETED' && <FaCheckCircle className="mr-2" />}
                {goal.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
