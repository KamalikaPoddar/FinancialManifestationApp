// src/components/ui/Input.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { FieldError } from 'react-hook-form'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block w-full rounded-md border',
              'focus:ring-primary-500 focus:border-primary-500',
              'sm:text-sm',
              icon ? 'pl-10' : 'pl-3',
              error
                ? 'border-red-300 text-red-900'
                : 'border-neutral-300 text-neutral-900',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
