import { z } from 'zod';

// Validation Schemas
export const goalSchema = z.object({
  title: z.string().min(3, "Goal title must be at least 3 characters"),
  targetAmount: z.number().min(1000, "Target amount must be at least ₹1,000"),
  deadline: z.date().min(new Date(), "Deadline must be in the future"),
  priority: z.number().min(1).max(3)
});

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.enum([
    'INCOME', 'HOUSING', 'TRANSPORTATION', 'FOOD', 
    'UTILITIES', 'HEALTHCARE', 'SAVINGS', 
    'INVESTMENTS', 'ENTERTAINMENT', 'MISC'
  ]),
  description: z.string().optional()
});

// Global Error Handler
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware for error handling
export const errorHandler = (err: Error, req: any, res: any, next: any) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Log unexpected errors
  console.error(err);

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  });
};

// Validation Middleware
export const validateRequest = (schema: z.ZodObject<any>) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'validation_error',
          errors: error.errors
        });
      }
      next(error);
    }
  };
};
