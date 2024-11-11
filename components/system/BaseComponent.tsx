// components/system/BaseComponent.tsx
import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import classNames from 'classnames'

interface BaseComponentProps extends React.HTMLAttributes<HTMLDivElement>, MotionProps {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseClasses = classNames(
    'transition-all duration-300 ease-in-out',
    {
      // Size variants
      'text-xs px-2 py-1': size === 'sm',
      'text-sm px-3 py-2': size === 'md',
      'text-base px-4 py-3': size === 'lg',
      
      // Color variants
      'bg-neutral-100 text-neutral-800': variant === 'default',
      'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
      'border border-primary-500 text-primary-500 hover:bg-primary-50': variant === 'secondary',
      'text-neutral-500 hover:bg-neutral-100': variant === 'ghost'
    },
    'rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500',
    className
  )

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClasses}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default BaseComponent
