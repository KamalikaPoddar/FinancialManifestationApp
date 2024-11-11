// components/FinancialCalculators/SavingsGoalCalculator.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import calculatorService from '../../services/FinancialCalculators'

interface SavingsGoalCalculatorProps {
  onClose: () => void
}

const SavingsGoalCalculator: React.FC<SavingsGoalCalculatorProps> = ({ onClose }) => {
  const [calculatorInputs, setCalculatorInputs] = useState({
    targetAmount: 0,
    currentSavings: 0,
    monthlyContribution: 0,
    timeframe: 0,
    interestRate: 6
  })

  const [result, setResult] = useState<any>(null)

  const handleCalculate = () => {
    const calculationResult = calculatorService.calculateSavingsGoal(calculatorInputs)
    setResult(calculationResult)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-white rounded-2xl shadow-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Savings Goal Calculator
        </h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>

      {/* Input Fields with CRED-like styling */}
      <div className="space-y-4">
        {Object.entries(calculatorInputs).map(([key, value]) => (
          <div key={key} className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setCalculatorInputs({
                ...calculatorInputs,
                [key]: Number(e.target.value)
              })}
              className="
                w-full 
                px-4 
                py-3 
                bg-gray-100 
                rounded-xl 
                focus:ring-2 
                focus:ring-blue-500 
                outline-none 
                transition-all
              "
            />
          </div>
        ))}
      </div>

      {/* Calculate Button */}
      <button 
        onClick={handleCalculate}
        className="
          w-full 
          mt-6 
          bg-gradient-to-br 
          from-blue-500 
          to-blue-700 
          text-white 
          py-4 
          rounded-xl 
          hover:shadow-lg 
          transition-all
        "
      >
        Calculate
      </button>

      {/* Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-100 rounded-xl p-4"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Savings Goal Insights
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(result).map(([key, value]) => (
              <div 
                key={key} 
                className="bg-white rounded-lg p-3 shadow-md"
              >
                <p className="text-sm text-gray-600">
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </p>
                <p className="text-lg font-bold">
                  {typeof value === 'number' 
                    ? value.toLocaleString('en-IN', { 
                        style: 'currency', 
                        currency: 'INR' 
                      }) 
                    : value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SavingsGoalCalculator
