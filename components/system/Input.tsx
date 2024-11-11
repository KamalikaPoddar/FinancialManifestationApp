// components/system/Input.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import classNames from 'classnames'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const inputClasses = classNames(
    'w-full px-3 py-2 rounded-lg',
    'border transition-all duration-300',
    {
      'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100': 
        !error,
      'border-red-500 text-red-600 focus:ring-red-100': 
        error
    },
    'disabled:bg-neutral-100 disabled:cursor-not-allowed',
    className
  )

  return (
    <div className="space-y-1">
      {label && (
        <motion.label 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </motion.label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-500 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input
