import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';

export default async function adminController(req: Request, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersLast30Days,
      totalWorkoutLogs,
      workoutLogsLast30Days,
      totalExercises,
      totalPlans,
      coachCount,
      adminCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.workoutLog.count(),
      prisma.workoutLog.count({
        where: {
          startedAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      prisma.exercise.count(),
      prisma.plan.count(),
      prisma.user.count({
        where: {
          role: 'COACH',
        },
      }),
      prisma.user.count({
        where: {
          role: 'ADMIN',
        },
      }),
    ]);

    res.json({
      users: {
        total: totalUsers,
        last30Days: usersLast30Days,
      },
      workoutLogs: {
        total: totalWorkoutLogs,
        last30Days: workoutLogsLast30Days,
      },
      exercises: totalExercises,
      plans: totalPlans,
      coaches: coachCount,
      admins: adminCount,
    });
  } catch (error) {
    next(error);
  }
}
