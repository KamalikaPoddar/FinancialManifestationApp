import React from 'react'
import { 
  FaHome, 
  FaGraduationCap, 
  FaCar, 
  FaPlane, 
  FaBriefcase 
} from 'react-icons/fa'

interface GoalCardProps {
  goal: {
    id: string
    title: string
    targetAmount: number
    currentAmount: number
    timeline: number
  }
}

const getGoalIcon = (title: string) => {
  const iconMap: { [key: string]: React.ElementType } = {
    'Buy a House': FaHome,
    'Education': FaGraduationCap,
    'Buy a Car': FaCar,
    'Travel or Relocation': FaPlane,
    'Start a Business': FaBriefcase
  }
  return iconMap[title] || FaBriefcase
}

export default function GoalCard({ goal }: GoalCardProps) {
  const Icon = getGoalIcon(goal.title)
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100, 
    100
  )

  // Calculate monthly savings needed
  const monthlySavingsNeeded = goal.targetAmount / goal.timeline

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 transform transition-all hover:scale-105">
      <div className="flex items-center mb-4">
        <Icon className="text-4xl text-blue-600 mr-4" />
        <h3 className="text-xl font-bold">{goal.title}</h3>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Target Amount</p>
        <p className="text-2xl font-bold text-blue-800">
          ₹{goal.targetAmount.toLocaleString()}
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Timeline</p>
        <p className="text-lg font-semibold">
          {goal.timeline} months
        </p>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 mb-2">Monthly Savings Needed</p>
        <p className="text-lg font-semibold text-green-600">
          ₹{monthlySavingsNeeded.toLocaleString()} / month
        </p>
      </div>
      
      <div>
        <p className="text-gray-600 mb-2">Progress</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>
            ₹{goal.currentAmount.toLocaleString()}
          </span>
          <span>
            {progressPercentage.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}
