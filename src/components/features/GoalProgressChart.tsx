// src/components/features/GoalProgressChart.tsx
'use client'

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts'

interface GoalProgressChartProps {
  targetAmount: number
  currentAmount: number
}

export default function GoalProgressChart({ 
  targetAmount, 
  currentAmount 
}: GoalProgressChartProps) {
  const progressPercentage = (currentAmount / targetAmount) * 100
  
  const data = [
    { name: 'Completed', value: currentAmount },
    { name: 'Remaining', value: Math.max(0, targetAmount - currentAmount) }
  ]

  const COLORS = ['#10B981', '#E5E7EB']

  return (
    <div className="h-40 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-2xl font-bold text-primary-600">
          {progressPercentage.toFixed(0)}%
        </p>
        <p className="text-xs text-neutral-500">Completed</p>
      </div>
    </div>
  )
}
