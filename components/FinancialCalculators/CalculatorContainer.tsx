// components/FinancialCalculators/CalculatorContainer.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaCalculator, 
  FaChartLine, 
  FaMoneyBillWave, 
  FaCoins, 
  FaChartPie 
} from 'react-icons/fa'

// Calculator Types
const CALCULATOR_TYPES = [
  {
    id: 'savings-goal',
    title: 'Savings Goal',
    icon: FaCoins,
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    id: 'debt-repayment',
    title: 'Debt Repayment',
    icon: FaMoneyBillWave,
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  },
  {
    id: 'investment-return',
    title: 'Investment Returns',
    icon: FaChartLine,
    color: 'bg-gradient-to-br from-purple-400 to-purple-600'
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Plan',
    icon: FaChartPie,
    color: 'bg-gradient-to-br from-red-400 to-red-600'
  }
]

const CalculatorContainer: React.FC = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<string | null>(null)

  const renderCalculatorContent = () => {
    switch(selectedCalculator) {
      case 'savings-goal':
        return <SavingsGoalCalculator onClose={() => setSelectedCalculator(null)} />
      case 'debt-repayment':
        return <DebtRepaymentCalculator onClose={() => setSelectedCalculator(null)} />
      case 'investment-return':
        return <InvestmentReturnCalculator onClose={() => setSelectedCalculator(null)} />
      case 'retirement-planning':
        return <RetirementPlanningCalculator onClose={() => setSelectedCalculator(null)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Financial Calculators
        </h1>

        {!selectedCalculator ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CALCULATOR_TYPES.map((calc) => (
              <motion.div
                key={calc.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCalculator(calc.id)}
                className={`
                  ${calc.color} 
                  rounded-2xl 
                  p-6 
                  text-white 
                  shadow-lg 
                  cursor-pointer 
                  transform 
                  transition-all 
                  hover:shadow-xl
                `}
              >
                <div className="flex items-center justify-between">
                  <calc.icon className="text-4xl" />
                  <h3 className="text-xl font-semibold">{calc.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          renderCalculatorContent()
        )}
      </motion.div>
    </div>
  )
}

export default CalculatorContainer
