import type { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { AppError } from '@/types/customError';

const usersQuerySchema = z.object({
  id: z.coerce.number().int().min(1).optional(),
  q: z.string().optional(),
  role: z.enum(Role).optional(),
  blocked: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  verified: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export default async function usersController(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = usersQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError('Invalid input', 400, true);

    const { id, q, role, blocked, verified, page } = parsed.data;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (id) where.id = id;
    if (role) where.role = role;
    if (blocked !== undefined) where.blocked = blocked;
    if (verified !== undefined) where.verified = verified;

    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          avatarUrl: true,
          verified: true,
          blocked: true,
          completed: true,
        },
        skip,
        take: pageSize + 1,
      }),
      prisma.user.count({ where }),
    ]);

    const hasMore = users.length > pageSize;
    const data = users.slice(0, pageSize);

    res.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        hasMore,
      },
    });
  } catch (error) {
    next(error);
  }
}
