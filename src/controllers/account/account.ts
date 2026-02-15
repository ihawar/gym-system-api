import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';

export default async function accountController(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.id) throw new AppError('No token provided', 401, true);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        phone: true,
        verified: true,
        completed: true,
        avatarUrl: true,
        bio: true,
        firstName: true,
        lastName: true,
        birthDate: true,
        heightCm: true,
        weight: true,
        role: true,
        _count: {
          select: {
            writtenPlans: true,
            accessiblePlans: true,
            workouts: true,
          },
        },
      },
    });

    if (!user) throw new AppError('User not found', 404, true);

    const { _count, ...userData } = user as any;

    const result = {
      ...userData,
      writtenPlansCount: _count?.writtenPlans ?? 0,
      accessiblePlansCount: _count?.accessiblePlans ?? 0,
      workoutsCount: _count?.workouts ?? 0,
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
}
