import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types/customError';
import logger from '@/lib/logger';

// Handle not founds
export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404, true));
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Decide status & message
  let statusCode = 500;
  let message = 'Something went wrong';

  // custom errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error(err);

  // for access token errors
  if (statusCode === 401) {
    res.set(
      'WWW-Authenticate',
      'Bearer error="invalid_token", error_description="Invalid or expired token"'
    );
  }
  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
    // only show stack in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
