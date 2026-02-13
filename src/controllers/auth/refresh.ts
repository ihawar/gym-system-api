import { createAccessToken, verifyRefreshToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';
import type { Request, Response, NextFunction } from 'express';

export async function RefreshController(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new AppError('No refresh token', 401, true);

    const { userId } = await verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: userId, blocked: false },
    });
    if (!user) throw new AppError('User not found or blocked', 401, true);

    // Create new access token
    const newAccessToken = await createAccessToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      completed: user.completed,
      verified: user.verified,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
}
