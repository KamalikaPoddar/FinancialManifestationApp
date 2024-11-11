// components/system/Card.tsx
import React from 'react'
import { motion } from 'framer-motion'
import classNames from 'classnames'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'glass'
  interactive?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  interactive = false,
  className,
  ...props
}) => {
  const cardClasses = classNames(
    'rounded-xl p-4 overflow-hidden',
    {
      'bg-white shadow-md': variant === 'elevated',
      'bg-neutral-100': variant === 'flat',
      'bg-white/10 backdrop-blur-lg border border-white/10': variant === 'glass'
    },
    interactive && 'cursor-pointer hover:shadow-lg transition-shadow',
    className
  )

  return (
    <motion.div
      whileHover={interactive ? { scale: 1.03 } : {}}
      whileTap={interactive ? { scale: 0.97 } : {}}
      className={cardClasses}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
