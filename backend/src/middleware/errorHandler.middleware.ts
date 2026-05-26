import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
  });
};

export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default {
  errorHandler,
  asyncHandler,
};
