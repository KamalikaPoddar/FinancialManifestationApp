// src/components/ui/Button.tsx
import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-600',
        outline: 'border border-primary text-primary hover:bg-primary-50',
        subtle: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
        ghost: 'hover:bg-neutral-100 text-neutral-700'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  loading,
  icon,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin">🔄</span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
