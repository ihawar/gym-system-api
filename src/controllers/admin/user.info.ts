import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AppError } from '@/types/customError';
import { Prisma } from '@prisma/client';

const paramsSchema = z.object({
  userId: z.coerce.number().min(1),
});
export default async function userInfoController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = paramsSchema.safeParse(req.params);
    if (!parsed.success) throw new AppError('Invalid input', 400, true);
    const { userId } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    });
    if (!user) throw new AppError('User not found.', 404, true);

    return res.json(user);
  } catch (error) {
    next(error);
  }
}
