import { Request, Response, NextFunction } from 'express';
import { AppError } from './errors';
import { createLogger } from '@/core/logger';

const logger = createLogger('ErrorHandler');

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error({ err, path: req.path, method: req.method }, 'Error occurred');

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  // Unhandled error
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
