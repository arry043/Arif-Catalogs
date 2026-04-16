import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = uuidv4();
  
  // Log error internally (could use a logger like winston)
  console.error(`[${requestId}] Error:`, err);

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.flatten().fieldErrors,
        request_id: requestId,
      },
    });
  }

  // Handle Prisma errors
  if (err.code && err.code.startsWith('P')) {
    const prismaErrorCodes: Record<string, string> = {
      P1001: 'Cannot connect to database. Is your DB running?',
      P1000: 'Authentication failed for the database.',
      P2002: 'A unique constraint failed.',
      P2025: 'Record not found.',
    };

    const message = prismaErrorCodes[err.code] || 'A database error occurred';
    
    return res.status(400).json({
      error: {
        code: 'DATABASE_ERROR',
        message: `${message} (Code: ${err.code})`,
        request_id: requestId,
        ...(process.env.NODE_ENV === 'development' && { internal_message: err.message }),
      },
    });
  }

  // Default internal server error
  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong on our end',
      request_id: requestId,
    },
  });
};
