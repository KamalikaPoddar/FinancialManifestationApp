// components/system/Button.tsx
import React from 'react'
import { motion } from 'framer-motion'
import classNames from 'classnames'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  ...props
}) => {
  const buttonClasses = classNames(
    'flex items-center justify-center',
    'transition-all duration-300 ease-in-out',
    'rounded-lg focus:outline-none focus:ring-2',
    {
      // Size variants
      'text-xs px-2 py-1': size === 'sm',
      'text-sm px-3 py-2': size === 'md',
      'text-base px-4 py-3': size === 'lg',
      
      // Color variants
      'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300': 
        variant === 'primary',
      'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-200': 
        variant === 'secondary',
      'text-neutral-500 hover:bg-neutral-100 focus:ring-neutral-200': 
        variant === 'ghost'
    },
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  )

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
      className={buttonClasses}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size={size} />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  )
}

// Loading Spinner Component
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <svg 
      className={`${spinnerSizes[size]} animate-spin text-white`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      ></circle>
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export default Button
