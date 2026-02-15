import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AppError } from '@/types/customError';
import { Role } from '@prisma/client';

const paramsSchema = z.object({
  userId: z.coerce.number().min(1),
});

const updateSchema = z.object({
  role: z.enum(Role).optional(),
  blocked: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  verified: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});
export default async function userUpdateController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = paramsSchema.safeParse(req.params);
    const body = updateSchema.safeParse(req.body);
    if (!params.success || !body.success) throw new AppError('Invalid input', 400, true);

    const data: any = {};
    if (body.data.blocked !== undefined) data.blocked = body.data.blocked;
    if (body.data.verified !== undefined) data.verified = body.data.verified;
    if (body.data.role !== undefined) data.role = body.data.role;

    const user = await prisma.user.findUnique({ where: { id: params.data.userId } });
    if (!user) throw new AppError('User not found.', 404, true);

    if (user.role === 'ADMIN' && req.user?.role !== 'OWNER') {
      throw new AppError('You can not modify another admin.', 403, true);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
      omit: { password: true },
    });

    return res.json(updatedUser);
  } catch (error) {
    next(error);
  }
}
