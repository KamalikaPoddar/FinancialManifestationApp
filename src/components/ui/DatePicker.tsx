// src/components/ui/DatePicker.tsx
'use client'

import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FieldError } from 'react-hook-form'

interface DatePickerProps {
  selected: Date | null
  onChange: (date: Date) => void
  placeholderText?: string
  icon?: React.ReactNode
  error?: FieldError
}

export default function DatePicker({ 
  selected, 
  onChange, 
  placeholderText,
  icon,
  error 
}: DatePickerProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 z-10">
          {icon}
        </div>
      )}
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        className={`
          w-full p-2 border rounded-md
          ${icon ? 'pl-10' : ''}
          ${error 
            ? 'border-red-500 text-red-900' 
            : 'border-neutral-300'}
        `}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  )
}
