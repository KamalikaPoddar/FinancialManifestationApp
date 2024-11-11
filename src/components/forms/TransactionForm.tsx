// src/components/forms/TransactionForm.tsx
'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FaSave, 
  FaTimes, 
  FaCalendar, 
  FaMoneyBillWave 
} from 'react-icons/fa'

import { Button, Input } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker'

// Transaction Categories
const TRANSACTION_CATEGORIES = {
  INCOME: [
    'Salary', 
    'Freelance', 
    'Investment Income', 
    'Other'
  ],
  EXPENSE: [
    'Rent', 
    'Utilities', 
    'Groceries', 
    'Transportation', 
    'Entertainment', 
    'Other'
  ]
}

// Transaction Form Schema
const TransactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string(),
  description: z.string().optional(),
  date: z.date().optional(),
  goalId: z.string().optional()
})

type TransactionFormData = z.infer<typeof TransactionSchema>

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<TransactionFormData>
  goals?: Array<{ id: string; title: string }>
}

export default function TransactionForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  goals = [] 
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>(
    initialData?.type || 'INCOME'
  )

  const { 
    register, 
    control, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<TransactionFormData>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      ...initialData,
      type: transactionType
    }
  })

  const submitHandler = async (data: TransactionFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...data,
        type: transactionType
      })
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(submitHandler)} 
      className="space-y-6 p-6 bg-white rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-4">
        {initialData ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>

      {/* Transaction Type Selector */}
      <div className="flex space-x-4 mb-4">
        <Button
          type="button"
          variant={transactionType === 'INCOME' ? 'default' : 'outline'}
          onClick={() => setTransactionType('INCOME')}
        >
          Income
        </Button>
        <Button
          type="button"
          variant={transactionType === 'EXPENSE' ? 'default' : 'outline'}
          onClick={() => setTransactionType('EXPENSE')}
        >
          Expense
        </Button>
      </div>

      <Input 
        type="number"
        label="Amount"
        placeholder="Enter transaction amount"
        {...register('amount', { 
          setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
        })}
        error={errors.amount}
        icon={<FaMoneyBillWave />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select 
          {...register('category')}
          className="w-full border rounded-md p-2"
        >
          {TRANSACTION_CATEGORIES[transactionType].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      {goals.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Associated Goal (Optional)
          </label>
          <select 
            {...register('goalId')}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select a Goal</option>
            {goals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <Input 
        label="Description (Optional)"
        placeholder="Additional transaction details"
        {...register('description')}
        error={errors.description}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Date
        </label>
        <Controller 
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker 
              selected={field.value || new Date()}
              onChange={(date) => field.onChange(date)}
              placeholderText="Select transaction date"
              icon={<FaCalendar />}
              error={errors.date}
            />
          )}
        />
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            <FaTimes className="mr-2" /> Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          variant="default" 
          loading={isSubmitting}
        >
          <FaSave className="mr-2" /> 
          {initialData ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  )
}
