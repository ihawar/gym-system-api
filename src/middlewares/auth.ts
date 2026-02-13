import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/lib/auth';
import { AppError } from '@/types/customError';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, true);
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      phone: payload.phone,
      role: payload.role as any,
      completed: payload.completed,
      verified: payload.verified,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('No token provided', 401, true));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, true));
    }

    next();
  };
};

export const completed = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('No token provided', 401, true));
  }
  if (!req.user.completed) {
    return next(new AppError('Account not completed.', 403, true));
  }
  next();
};

export const verified = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('No token provided', 401, true));
  }
  if (!req.user.verified) {
    return next(new AppError('Account not verified.', 403, true));
  }
  next();
};
