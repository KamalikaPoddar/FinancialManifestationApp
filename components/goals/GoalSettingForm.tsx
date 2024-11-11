import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface GoalData {
  title: string
  targetAmount: number
  deadline: Date
  priority: number
}

export default function GoalSettingForm() {
  const { data: session } = useSession()
  const [goalData, setGoalData] = useState<GoalData>({
    title: '',
    targetAmount: 0,
    deadline: new Date(),
    priority: 3
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      alert('Please log in')
      return
    }

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...goalData,
          userId: session.user.id
        })
      })

      if (response.ok) {
        // Handle successful goal creation
        alert('Goal created successfully!')
      }
    } catch (error) {
      console.error('Goal creation failed', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text"
        placeholder="Goal Title"
        value={goalData.title}
        onChange={(e) => setGoalData({...goalData, title: e.target.value})}
        required
      />
      <input 
        type="number"
        placeholder="Target Amount"
        value={goalData.targetAmount}
        onChange={(e) => setGoalData({...goalData, targetAmount: Number(e.target.value)})}
        required
      />
      <input 
        type="date"
        value={goalData.deadline.toISOString().split('T')[0]}
        onChange={(e) => setGoalData({...goalData, deadline: new Date(e.target.value)})}
        required
      />
      <select 
        value={goalData.priority}
        onChange={(e) => setGoalData({...goalData, priority: Number(e.target.value)})}
      >
        <option value={1}>Low Priority</option>
        <option value={2}>Medium Priority</option>
        <option value={3}>High Priority</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2">
        Create Goal
      </button>
    </form>
  )
}
