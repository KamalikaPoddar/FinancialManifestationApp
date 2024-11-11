import { useState, useEffect } from 'react'
import { FaEdit } from 'react-icons/fa'

interface GoalEditModalProps {
  goal: {
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    deadline: Date
    priority: number
  }
  onUpdate: (updatedGoal: any) => void
  onClose: () => void
}

export default function GoalEditModal({ 
  goal, 
  onUpdate, 
  onClose 
}: GoalEditModalProps) {
  const [editedGoal, setEditedGoal] = useState({
    title: goal.title,
    targetAmount: goal.targetAmount,
    deadline: new Date(goal.deadline).toISOString().split('T')[0],
    priority: goal.priority,
    currentAmount: goal.currentAmount
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedGoal)
      })

      if (response.ok) {
        const updatedGoal = await response.json()
        onUpdate(updatedGoal)
        onClose()
      }
    } catch (error) {
      console.error('Goal update failed', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Edit Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Goal Title</label>
            <input 
              type="text"
              value={editedGoal.title}
              onChange={(e) => setEditedGoal({
                ...editedGoal, 
                title: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Target Amount</label>
            <input 
              type="number"
              value={editedGoal.targetAmount}
              onChange={(e) => setEditedGoal({
                ...editedGoal, 
                targetAmount: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Current Savings</label>
            <input 
              type="number"
              value={editedGoal.currentAmount}
              onChange={(e) => setEditedGoal({
                ...editedGoal, 
                currentAmount: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Deadline</label>
            <input 
              type="date"
              value={editedGoal.deadline}
              onChange={(e) => setEditedGoal({
                ...editedGoal, 
                deadline: e.target.value
              })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Priority</label>
            <select
              value={editedGoal.priority}
              onChange={(e) => setEditedGoal({
                ...editedGoal, 
                priority: Number(e.target.value)
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Update Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
