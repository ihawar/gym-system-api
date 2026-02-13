import { prisma } from '@/lib/prisma';
import { AppError } from '@/types/customError';
import { hashPassword } from '@/utils/auth';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const completeSchema = z.object({
  password: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
});

export async function CompleteController(req: Request, res: Response, next: NextFunction) {
  try {
    const body = completeSchema.safeParse(req.body);
    if (!body.success) throw new AppError('Invalid input', 400, true);
    let { firstName, lastName, password } = body.data;

    if (!req.user?.id) throw new AppError('Unauthorized', 401, true);

    const user = await prisma.user.updateMany({
      where: { id: req.user?.id, completed: false },
      data: {
        password: hashPassword(password),
        firstName: firstName,
        lastName: lastName,
        completed: true,
      },
    });
    if (user.count == 0) throw new AppError('User already completed.', 401, true);

    return res.json({ message: 'Account completed successfully.' });
  } catch (err) {
    next(err);
  }
}
