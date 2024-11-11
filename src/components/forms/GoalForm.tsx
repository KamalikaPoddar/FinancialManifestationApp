// src/components/forms/GoalForm.tsx
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

// Goal Form Schema
const GoalSchema = z.object({
  title: z.string().min(3, "Goal title must be at least 3 characters"),
  description: z.string().optional(),
  targetAmount: z.number().positive("Target amount must be positive"),
  targetDate: z.date().refine(
    (date) => date > new Date(), 
    "Target date must be in the future"
  )
})

type GoalFormData = z.infer<typeof GoalSchema>

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => Promise<void>
  onCancel?: () => void
  initialData?: Partial<GoalFormData>
}

export default function GoalForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: GoalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<GoalFormData>({
    resolver: zodResolver(GoalSchema),
    defaultValues: initialData
  })

  const submitHandler = async (data: GoalFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      // Reset form or close modal
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
        {initialData ? 'Edit Goal' : 'Create New Goal'}
      </h2>

      <Input 
        label="Goal Title"
        placeholder="e.g., Emergency Fund, Vacation"
        {...register('title')}
        error={errors.title}
        icon={<FaMoneyBillWave />}
      />

      <Input 
        label="Description (Optional)"
        placeholder="Additional details about your goal"
        {...register('description')}
        error={errors.description}
      />

      <Input 
        type="number"
        label="Target Amount"
        placeholder="Enter target savings amount"
        {...register('targetAmount', { 
          setValueAs: (v) => v === '' ? undefined : parseFloat(v) 
        })}
        error={errors.targetAmount}
        icon={<FaMoneyBillWave />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Date
        </label>
        <Controller 
          name="targetDate"
          control={control}
          render={({ field }) => (
            <DatePicker 
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              placeholderText="Select target date"
              icon={<FaCalendar />}
              error={errors.targetDate}
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
          {initialData ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  )
}
