import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface Goal {
  id?: string
  title: string
  targetAmount: number
  deadline: Date
  description?: string
}

export default function ManifestationGoals() {
  const { data: session } = useSession()
  const [goals, setGoals] = useState<Goal[]>([])
  const [newGoal, setNewGoal] = useState<Goal>({
    title: '',
    targetAmount: 0,
    deadline: new Date(),
    description: ''
  })

  const handleAddGoal = async () => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newGoal,
          userId: session?.user?.id
        })
      })

      if (response.ok) {
        const addedGoal = await response.json()
        setGoals([...goals, addedGoal])
        // Reset form
        setNewGoal({
          title: '',
          targetAmount: 0,
          deadline: new Date(),
          description: ''
        })
      }
    } catch (error) {
      console.error('Goal creation failed', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Your Manifestation Goals
      </h1>

      {/* Goal Creation Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Create New Goal
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input 
            type="text"
            placeholder="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input 
            type="number"
            placeholder="Target Amount"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({...newGoal, targetAmount: Number(e.target.value)})}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input 
            type="date"
            value={newGoal.deadline.toISOString().split('T')[0]}
            onChange={(e) => setNewGoal({...newGoal, deadline: new Date(e.target.value)})}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea 
            placeholder="Goal Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button 
          onClick={handleAddGoal}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div 
            key={goal.id} 
            className="bg-white shadow-md rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-2">
              {goal.title}
            </h3>
            <p>Target Amount: ₹{goal.targetAmount.toLocaleString()}</p>
            <p>Deadline: {goal.deadline.toLocaleDateString()}</p>
            {goal.description && (
              <p className="mt-2 text-gray-600">
                {goal.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
